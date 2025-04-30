import { Agent } from "../../agent";
import { TransactionResponse } from "../../types";
import { SUI_COIN_TYPE, SUI_DECIMALS } from "../../constants";
import { SUI_SYSTEM_STATE_OBJECT_ID } from "@mysten/sui/utils";
import { Transaction } from "@mysten/sui/transactions";

export const stake = async (
    agent: Agent,
    amount: number,
    poolId: string
): Promise<TransactionResponse> => {
    const client = agent.client;

    if (!agent.walletAddress) {
        throw new Error("Invalid wallet address")
    }

    if (!agent.wallet) {
        throw new Error("Signer is not provided")
    }

    // prepare transaction
    const txb = new Transaction();
    txb.setSender(agent.walletAddress);
    txb.setGasOwner(agent.walletAddress);

    // get the coin object
    const allCoins = await client.getCoins({
        owner: agent.walletAddress,
        coinType: SUI_COIN_TYPE,
    });
    const [mainCoin, ...restCoins] = allCoins.data;

    // merge the coins
    if (restCoins.length > 0) {
        txb.mergeCoins(
            txb.object(mainCoin.coinObjectId),
            restCoins.map((coin) => txb.object(coin.coinObjectId)),
        );
    }

    // check if the balance is enough
    const decimals = SUI_DECIMALS;
    const totalBalance = allCoins.data.reduce(
        (output, coin) => output + Number(coin.balance),
        0,
    );

    const balance = totalBalance / 10 ** decimals;
    if (balance < amount || amount < 1) {
        throw new Error("Insufficient balance");
    }

    // Convert amount to base units before splitting
    const amountInBaseUnits = BigInt(Math.floor(amount * 10 ** decimals));

    // split the coin using base units
    const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(amountInBaseUnits)]);

    // stake the coin
    txb.moveCall({
        target: "0x3::sui_system::request_add_stake",
        arguments: [
            txb.sharedObjectRef({
                objectId: SUI_SYSTEM_STATE_OBJECT_ID,
                initialSharedVersion: 1,
                mutable: true,
            }),
            coin,
            txb.pure.address(poolId),
        ],
    });

    const txOutput = await client.signAndExecuteTransaction({
        signer: agent.wallet,
        transaction: txb,
    });

    // wait for the transaction to be executed
    const res = await client.waitForTransaction({
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