
import { z } from "zod";
import { Agent } from "../../agent"
import { type McpTool } from "../../types";

export const StakeSuiTool: McpTool = {
    name: "sui_stake",
    description: "Stake SUI tokens to a validator pool",
    schema: {
        amount: z.number().positive().min(1)
            .describe("The amount of SUI to stake (minimum 1 SUI)"),
        validatorAddress: z.string()
            .describe("The validator pool address to stake to (Use get_validators_tool to list available validators and their details)")
    },
    handler: async (agent: Agent, input: Record<string, any>) => {
        try {

            const result = await agent.stake(input.amount, input.validatorAddress)

            return {
                message: `Successfully staked ${input.amount} SUI to validator pool ${input.validatorAddress}`,
                ...result
            };
        } catch (error: any) {
            throw new Error(`Failed to stake SUI tokens: ${error.message}`)
        }
    }
};