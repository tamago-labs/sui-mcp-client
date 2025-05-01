
import { z } from "zod";
import { Agent } from "../../agent"
import { type McpTool } from "../../types";

export const SwapTokensTool: McpTool = {
    name: "sui_swap_tokens",
    description: "Swap tokens on Sui using Cetus DEX Aggregator",
    schema: {
        fromToken: z.string()
            .describe("The symbol of the token to swap from (e.g., 'SUI')"),
        toToken: z.string()
            .describe("The symbol of the token to swap to"),
        amount: z.number().positive()
            .describe("The amount of tokens to swap")
    },
    handler: async (agent: Agent, input: Record<string, any>) => {

        try {

            const result = await agent.swap(input.fromToken, input.toToken, input.amount)

            return {
                message: `Successfully swapped token from ${input.fromToken} to ${input.toToken}`,
                ...result
            };
        } catch (error: any) {
            throw new Error(`Failed to swap tokens: ${error.message}`)
        }

    }

}