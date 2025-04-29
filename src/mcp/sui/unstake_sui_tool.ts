
import { z } from "zod";
import { Agent } from "../../agent"
import { type McpTool } from "../../types";

export const UnstakeSuiTool: McpTool = {
    name: "sui_unstake",
    description: "Unstake SUI tokens from a validator pool",
    schema: {
        stakedSuiId: z.string()
            .describe("The ID of the staked SUI object to unstake")
    },
    handler: async (agent: Agent, input: Record<string, any>) => {
        try {

            const result = await agent.unstake(input.stakedSuiId)

            return {
                message: `Successfully unstaked SUI from object ${input.stakedSuiId.substring(0, 10)}...`,
                ...result
            };
        } catch (error: any) {
            throw new Error(`Failed to unstake SUI tokens: ${error.message}`)
        }
    }
};