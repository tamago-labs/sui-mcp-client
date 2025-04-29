import { Agent } from "../../agent";
import { TransactionResponse } from "../../types";
import { SUI_COIN_TYPE, SUI_DECIMALS } from "../../constants";
import { SUI_SYSTEM_STATE_OBJECT_ID } from "@mysten/sui/utils";
import { Transaction } from "@mysten/sui/transactions";


export const unstake = async (
    agent: Agent,
    stakedSuiId: string
): Promise<TransactionResponse> => {

    const client = agent.client;

    // prepare transaction
    const txb = new Transaction();
    txb.setSender(agent.walletAddress);
    txb.setGasOwner(agent.walletAddress);

    // get the coin object
    txb.moveCall({
        target: "0x3::sui_system::request_withdraw_stake",
        arguments: [
            txb.object(SUI_SYSTEM_STATE_OBJECT_ID),
            txb.object(stakedSuiId),
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