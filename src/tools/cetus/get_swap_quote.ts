import { Agent } from "../../agent";
import { AggregatorClient, Env } from "@cetusprotocol/aggregator-sdk";
import { CETUS_SUPPORT_LIST } from "../../constants";
import { BigNumber } from "bignumber.js";
import { SwapQuote } from "../../types";

export const getSwapQuote = async (agent: Agent, fromToken: string, toToken: string, amount: number): Promise<SwapQuote> => {

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

    const toTokenMetadata = await agent.client.getCoinMetadata({
        coinType: toTokenEntry.coinType,
    });

    // Initialize the Cetus Aggregator client
    // const client = new AggregatorClient({
    //     client: agent.client,
    //     env: agent.network === "mainnet" ? Env.Mainnet : Env.Testnet
    // })

    // const routers = await client.findRouters({
    //     from: fromTokenEntry.coinType,
    //     target: toTokenEntry.coinType,
    //     amount: `${((new BigNumber(amount)).multipliedBy(10 ** (fromTokenMetadata?.decimals || 9)))}`,
    //     byAmountIn: true,
    // })

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

    return {
        fromToken: fromToken.toUpperCase(),
        toToken: toToken.toUpperCase(),
        inputAmount: amount,
        estimatedOutput: Number(((new BigNumber(data?.outputAmount.toString())).dividedBy(10 ** (toTokenMetadata?.decimals || 9))))
    }
}