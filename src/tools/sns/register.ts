import { SuinsClient, SuinsTransaction } from "@mysten/suins";
import { Agent } from "../../agent";
import { TransactionResponse } from "../../types";
import { Transaction } from "@mysten/sui/transactions";
import { MIST_PER_SUI } from "@mysten/sui/utils";

export const registerSns = async (
    agent: Agent,
    name: string,
    years: number,
    payToken: "SUI" | "USDC" | "NS",
) : Promise<TransactionResponse> => {

    const suinsClient = new SuinsClient({
        client: agent.client as any,
        network: "mainnet",
      });
  
      const tx = new Transaction();
  
      if (!["SUI", "USDC", "NS"].includes(payToken)) {
        throw new Error("Invalid payToken");
      }
      const coinConfig = suinsClient.config.coins[payToken]; // Specify the coin type used for the transaction
  
      const priceInfoObjectId =
        coinConfig !== suinsClient.config.coins.USDC
          ? (await suinsClient.getPriceInfoObject(tx as any, coinConfig.feed))[0]
          : null;
  
      const suinsTx = new SuinsTransaction(suinsClient, tx as any);
  
      const [coinInput] = suinsTx.transaction.splitCoins(
        suinsTx.transaction.gas,
        [5n * MIST_PER_SUI],
      );
  
      const nft = suinsTx.register({
        domain: name + ".sui",
        years: years,
        coinConfig: coinConfig,
        coin: coinInput,
        priceInfoObjectId,
      });
  
      // Sets the target address of the NFT.
      suinsTx.setTargetAddress({
        nft,
        address: agent.walletAddress,
        isSubname: false,
      });
  
      // Transfer the NFT to the main's wallet
      suinsTx.transaction.transferObjects([nft], agent.walletAddress);
  
      tx.setSender(agent.walletAddress);
  
      // execute the transaction
      const txOutput = await agent.client.signAndExecuteTransaction({
        signer: agent.wallet,
        transaction: tx,
      });
  
      // wait for the transaction to be executed
      const res = await agent.client.waitForTransaction({
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