

// @ts-expect-error no check
import initMoveByteCodeTemplate from "../../utils/move-template/move-bytecode-template"
import { getBytecode, ICreateTokenForm } from "../../utils/move-template/coin";
import { Agent } from "../../agent";
import { normalizeSuiAddress, SUI_TYPE_ARG } from "@mysten/sui/utils";
import { CREATE_TOKEN_SUI_FEE } from "../../constants"
import { Transaction } from "@mysten/sui/transactions";
import { TransactionResponse } from "../../types";

// deploy a new coin
export const deployCoin = async (agent: Agent, form: ICreateTokenForm): Promise<TransactionResponse> => {

    const client = agent.client;

    await initMoveByteCodeTemplate(
        "https://www.suicoins.com/move_bytecode_template_bg.wasm",
    );

    const tx = new Transaction();

    const allSuiCoins = await client.getCoins({
        owner: agent.walletAddress,
        coinType: SUI_TYPE_ARG
    })

    const totalSuiBalance = allSuiCoins.data.reduce(
        (result, coin) => result + Number(coin.balance),
        0,
    );

    if (totalSuiBalance < CREATE_TOKEN_SUI_FEE) {
        throw new Error("Insufficient balance");
    }

    const [fee] = tx.splitCoins(tx.gas, [String(CREATE_TOKEN_SUI_FEE)]);

    tx.transferObjects([fee], tx.pure.address(agent.walletAddress));

    const bytecode = await getBytecode({
        name: form.name,
        symbol: form.symbol,
        totalSupply: form.totalSupply,
        decimals: form.decimals,
        imageUrl: form.imageUrl,
        description: form.description,
        fixedSupply: form.fixedSupply,
        recipient: agent.walletAddress,
    });

    const [upgradeCap] = tx.publish({
        modules: [[...bytecode]],
        dependencies: [normalizeSuiAddress("0x1"), normalizeSuiAddress("0x2")],
    });

    tx.transferObjects([upgradeCap], tx.pure.address(agent.walletAddress));

    const txExec = await client.signAndExecuteTransaction({
        transaction: tx,
        signer: agent.wallet,
    });

    // wait for the transaction to be executed
    const res = await client.waitForTransaction({
        digest: txExec.digest,
        options: {
            showEffects: true,
        },
    });

    return {
        digest: txExec.digest,
        status: res.effects?.status.status || "unknown",
    };
}