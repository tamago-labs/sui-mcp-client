import { DelegatedStake } from "@mysten/sui/client";
import { Agent } from "../../agent";

export const getStake = async (agent: Agent, walletAddress: string): Promise<DelegatedStake[]> => {
    const client = agent.client; 
    const result = await client.getStakes({ owner: walletAddress }); 
    return result;
}