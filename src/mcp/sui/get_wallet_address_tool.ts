
import { z } from "zod";
import { Agent } from "../../agent"
import { type McpTool } from "../../types";


export const GetWalletAddressTool: McpTool = {
    name: "sui_get_wallet_address",
    description: "Get the active wallet address",
    schema: {},
    handler: async (agent: Agent, input: Record<string, any>) => {
        return {
            status: "success",
            walletAddress: agent.walletAddress
        };
    },
}