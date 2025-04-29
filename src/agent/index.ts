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


export class Agent {

    public client: SuiClient
    public wallet: Ed25519Keypair
    public walletAddress: string;
    public network: 'testnet' | 'mainnet'

    constructor(
        privateKey: string,
        network: 'testnet' | 'mainnet'
    ) {
        this.client = new SuiClient({
            url: getFullnodeUrl(network)
        })

        this.wallet = Ed25519Keypair.fromSecretKey(privateKey);
        this.walletAddress = this.wallet.getPublicKey().toSuiAddress();
        this.network = network
    }

    getWalletAddress(): string {
        return this.walletAddress;
    }

    async getAllBalances(walletAddress: string): Promise<TokenBalance[]> {
        return getAllBalances(this, walletAddress)
    }

    async transferToken(
        tokenSymbol: string,
        to: string,
        amount: number,
    ): Promise<TransactionResponse> {
        return transferCoin(this, tokenSymbol, to, amount)
    }

    async deployToken(
        form: ICreateTokenForm
    ): Promise<TransactionResponse> {
        return deployCoin(this, form)
    }

    async stake(
        amount: number, poolId: string
    ): Promise<TransactionResponse> {
        return stake(this, amount, poolId)
    }

    async unstake(
        stakedSuiId: string
    ): Promise<TransactionResponse> {
        return unstake(this, stakedSuiId)
    }

    async getStake(): Promise<DelegatedStake[]> {
        return getStake(this)
    }

    async registerSns(
        name: string,
        years: number,
        payToken: "SUI" | "USDC" | "NS",
    ): Promise<TransactionResponse> {
        return registerSns(this, name, years, payToken)
    }

    async getSnsNameRecord(name: string): Promise<NameRecord | undefined> {
        return getNameRecord(this, name)
    }



}