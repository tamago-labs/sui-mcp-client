import { Agent } from "../../agent";
import { AggregatorClient, Env } from "@cetusprotocol/aggregator-sdk";
import { CETUS_SUPPORT_LIST } from "../../constants";
import { BigNumber } from "bignumber.js";
import { TransactionResponse } from "../../types";
import { Transaction } from "@mysten/sui/transactions";


export const swap = async (agent: Agent, fromToken: string, toToken: string, amount: number): Promise<TransactionResponse> => {

    if (!agent.walletAddress) {
        throw new Error("Invalid wallet address")
    }

    if (!agent.wallet) {
        throw new Error("Signer is not provided")
    }

    if (agent.network !== "mainnet") {
        throw new Error("Only Sui Mainnet is supported.")
    }

    if (!CETUS_SUPPORT_LIST.map(item => item.symbol).includes(fromToken.toLowerCase())) {
        throw new Error(`The source token "${fromToken}" is not supported.`)
    }

    if (!CETUS_SUPPORT_LIST.map(item => item.symbol).includes(toToken.toLowerCase())) {
        throw new Error(`The destination token "${toToken}" is not supported.`)
    }

    if (fromToken.toLowerCase() === toToken.toLowerCase()) {
        throw new Error("Source and destination tokens must be different.");
    }

    const fromTokenEntry = CETUS_SUPPORT_LIST.find(item => item.symbol === fromToken.toLowerCase())
    const toTokenEntry = CETUS_SUPPORT_LIST.find(item => item.symbol === toToken.toLowerCase())

    if (!fromTokenEntry || !toTokenEntry) {
        throw new Error("Invalid token entry")
    }

    const fromTokenMetadata = await agent.client.getCoinMetadata({
        coinType: fromTokenEntry.coinType,
    });

    const response = await fetch(`${agent.apiUrl}/swap?from_token=${fromTokenEntry.coinType}&to_token=${toTokenEntry.coinType}&amount=${((new BigNumber(amount)).multipliedBy(10 ** (fromTokenMetadata?.decimals || 9)))}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }

    const data: any = await response.json();

    const routers = data.routers

    // Initialize the Cetus Aggregator client
    const client = new AggregatorClient({
        client: agent.client,
        env: agent.network === "mainnet" ? Env.Mainnet : Env.Testnet
    })

    // prepare transaction
    const txb = new Transaction();
    txb.setSender(agent.walletAddress);
    txb.setGasOwner(agent.walletAddress)

    await client.fastRouterSwap({
        routers,
        txb,
        slippage: 0.03,
    })

    const result = await client.devInspectTransactionBlock(txb)

    const suiClient = agent.client;

    console.error(result)

    if (result.effects?.status.status !== "success") {
        throw new Error("Failed to simulate swap execution. Please verify your inputs and try again.")
    }

    const txOutput = await suiClient.signAndExecuteTransaction({
        signer: agent.wallet,
        transaction: txb,
    });

    // wait for the transaction to be executed
    const res = await suiClient.waitForTransaction({
        digest: txOutput.digest,
        options: {
            showEffects: true,
        },
    });

    return {
        digest: txOutput.digest,
        status: res.effects?.status.status || "unknown",
    };

}