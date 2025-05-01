
import { z } from "zod";
import { Agent } from "../../agent"
import { type McpTool } from "../../types";

export const GetSwapQuoteTool: McpTool = {
    name: "sui_get_swap_quote",
    description: "Retrieve a token swap quote using the Cetus DEX aggregator without executing the transaction",
    schema: {
        fromToken: z.string()
            .describe("The symbol of the token to swap from (e.g., 'SUI')"),
        toToken: z.string()
            .describe("The symbol of the token to swap to"),
        amount: z.number().positive()
            .describe("The amount of tokens to swap")
    },
    handler: async (agent: Agent, input: Record<string, any>) => {

        const result = await agent.getSwapQuote(
            input.fromToken,
            input.toToken,
            input.amount
        )
 
        return {
            status: "success",
            ...result
        };

    }

}