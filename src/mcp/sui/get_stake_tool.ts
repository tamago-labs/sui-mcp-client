
import { z } from "zod";
import { Agent } from "../../agent"
import { type McpTool } from "../../types";


export const GetStakeTool: McpTool = {
    name: "sui_get_stake",
    description: "Get all staked SUI tokens and their validator pools for the active wallet",
    schema: {},
    handler: async (agent: Agent, input: Record<string, any>) => {

        const result = await agent.getStake()

        return {
            status: "success",
            ...result
        };
    },
}