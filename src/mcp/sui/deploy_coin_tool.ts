
import { z } from "zod";
import { Agent } from "../../agent"
import { ICreateTokenForm } from "../../utils/move-template/coin"
import { type McpTool } from "../../types";

export const DeployTokenTool: McpTool = {
    name: "sui_deploy_token",
    description: "Deploy a new token on the Sui blockchain",
    schema: {
        name: z.string()
            .describe("The name of the token"),
        symbol: z.string()
            .describe("The symbol/ticker of the token"),
        decimals: z.number().int().min(0).max(9)
            .describe("Number of decimal places (typically between 0-9)"),
        description: z.string().optional()
            .describe("Description of the token (optional)"),
        icon_url: z.string().url().optional()
            .describe("URL to the token's icon image (optional)"),
        total_supply: z.number().positive()
            .describe("Initial total supply of the token"),
        fixed_supply: z.boolean()
            .describe("Whether the supply is fixed or can be changed later")
    },
    handler: async (agent: Agent, input: Record<string, any>) => {
        try {
            const tokenParams: ICreateTokenForm = {
                name: input.name,
                symbol: input.symbol,
                totalSupply: input.total_supply,
                decimals: input.decimals,
                imageUrl: input?.icon_url,
                description: input?.description || "",
                fixedSupply: input.fixed_supply
            };

            const result = await agent.deployToken(tokenParams);

            return {
                message: `Successfully deployed ${input.name} (${input.symbol}) token on Sui blockchain`,
                ...result
            };
        } catch (error: any) {
            throw new Error(`Failed to deploy token: ${error.message}`)
        }
    }
};