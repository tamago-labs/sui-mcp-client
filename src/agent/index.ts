import { DelegatedStake, getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { NameRecord } from "@mysten/suins/dist/cjs/types";
import { TokenBalance, TransactionResponse } from "../types";
import { getAllBalances } from "../tools/sui/balance";
import { transferCoin } from "../tools/sui/transfer_coin";
import { ICreateTokenForm } from "../utils/move-template/coin";
import { deployCoin } from "../tools/sui/deploy_coin";
import { stake } from "../tools/sui/stake";
import { unstake } from "../tools/sui/unstake";
import { registerSns } from "../tools/sns/register";
import { getNameRecord } from "../tools/sns/get_name";
import { getStake } from "../tools/sui/get_stake";
import { getSuiConfig } from "../config";

export class Agent {

    public client: SuiClient
    public wallet?: Ed25519Keypair
    public walletAddress?: string;
    public network: 'testnet' | 'mainnet'
    public accessKey?: string;
    public apiUrl?: string;
    public mode: 'private-key' | 'access-key';

    constructor() {

        const config = getSuiConfig()

        this.client = new SuiClient({
            url: getFullnodeUrl(config.network)
        });

        this.network = config.network;
        this.mode = config.mode;

        if (config.mode === 'private-key' && config.privateKey) {
            // Initialize wallet using private key
            this.wallet = Ed25519Keypair.fromSecretKey(config.privateKey);
            this.walletAddress = this.wallet.getPublicKey().toSuiAddress();
        } else if (config.mode === 'access-key' && config.accessKey) {
            // Store access key for API authentication
            this.accessKey = config.accessKey;
            this.apiUrl = config.apiUrl;
            // Wallet address will be fetched from API when needed
        } else {
            throw new Error('Invalid configuration: Either private key or access key must be provided');
        }
    }

    async getWalletAddress(): Promise<string> {
        if (this.mode === 'private-key' && this.walletAddress) {
            return this.walletAddress;
        } else if (this.mode === 'access-key' && this.accessKey && this.apiUrl) {
            return await this.fetchWalletAddressFromApi();
        } else {
            throw new Error('Unable to determine wallet address: Invalid configuration');
        }
    }

    async getAllBalances(walletAddress: string | undefined): Promise<TokenBalance[]> {

        if (this.mode === 'private-key' && this.walletAddress) {
            return getAllBalances(this, walletAddress || this.walletAddress)
        } else if (this.mode === 'access-key' && this.accessKey && this.apiUrl) {
            const currentWalletAddress = await this.fetchWalletAddressFromApi()
            return getAllBalances(this, currentWalletAddress)
        } else {
            throw new Error('Unable to fetch token balances: Invalid configuration');
        }
    }

    async transferToken(
        tokenSymbol: string,
        to: string,
        amount: number,
    ): Promise<TransactionResponse> {

        if (this.mode === 'private-key' && this.wallet) {
            return transferCoin(this, tokenSymbol, to, amount);
        } else if (this.mode === 'access-key') {
            return this.executeRemoteTransaction("TransferTokenTool", {
                tokenSymbol,
                to,
                amount
            });
        } else {
            throw new Error('Unable to transfer token: Invalid configuration');
        }

    }

    async deployToken(
        form: ICreateTokenForm
    ): Promise<TransactionResponse> {
        if (this.mode === 'private-key' && this.wallet) {
            return deployCoin(this, form);
        } else if (this.mode === 'access-key') {
            return this.executeRemoteTransaction(
                "DeployTokenTool",
                {
                    ...form
                });
        } else {
            throw new Error('Unable to deploy token: Invalid configuration');
        }
    }

    async stake(
        amount: number, poolId: string
    ): Promise<TransactionResponse> {
        if (this.mode === 'private-key' && this.wallet) {
            return stake(this, amount, poolId);
        } else if (this.mode === 'access-key') {
            return this.executeRemoteTransaction(
                "StakeSuiTool",
                {
                    amount,
                    poolId
                });
        } else {
            throw new Error('Unable to stake: Invalid configuration');
        }
    }

    async unstake(
        stakedSuiId: string
    ): Promise<TransactionResponse> {
        if (this.mode === 'private-key' && this.wallet) {
            return unstake(this, stakedSuiId);
        } else if (this.mode === 'access-key') {
            return this.executeRemoteTransaction(
                "UnstakeSuiTool",
                {
                    stakedSuiId
                });
        } else {
            throw new Error('Unable to unstake: Invalid configuration');
        }
    }

    async getStake(): Promise<DelegatedStake[]> {
        if (this.mode === 'private-key' && this.walletAddress) {
            return getStake(this, this.walletAddress);
        } else if (this.mode === 'access-key') {
            const currentWalletAddress = await this.fetchWalletAddressFromApi()
            return getStake(this, currentWalletAddress)
        } else {
            throw new Error('Unable to get stake information: Invalid configuration');
        }
    }

    async registerSns(
        name: string,
        years: number,
        payToken: "SUI" | "USDC" | "NS",
    ): Promise<TransactionResponse> {
        if (this.mode === 'private-key' && this.wallet) {
            return registerSns(this, name, years, payToken);
        } else if (this.mode === 'access-key') {
            return this.executeRemoteTransaction(
                "RegisterSnsTool",
                {
                    name,
                    years,
                    payToken
                });
        } else {
            throw new Error('Unable to register SNS domain: Invalid configuration');
        }
    }

    async getSnsNameRecord(name: string): Promise<NameRecord | undefined> {
        return getNameRecord(this, name)
    }

    private async fetchWalletAddressFromApi(): Promise<string> {
        try {
            const response = await fetch(`${this.apiUrl}/wallet?access_key=${this.accessKey}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data: any = await response.json();
            return data.walletAddress;
        } catch (error: any) {
            throw new Error(`Failed to fetch wallet address: ${error.message}`);
        }
    }

    private async executeRemoteTransaction(toolName: string, txParams: any): Promise<any> {
        try {
            const response = await fetch(`${this.apiUrl}/transaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    accessKey: this.accessKey,
                    toolName,
                    params: txParams,
                    network: this.network
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            // const data = await response.json();

            return {
                status: "pending_approval",
                message: 'Transaction requires approval in the dashboard'
            };

        } catch (error: any) {
            throw new Error(`Failed to execute remote transaction: ${error.message}`);
        }
    }



}