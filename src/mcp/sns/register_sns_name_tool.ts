
import { z } from "zod";
import { Agent } from "../../agent"
import { type McpTool } from "../../types";


export const RegisterSnsTool: McpTool = {
    name: "sui_register_sns",
    description: "Register a Sui Name Service (SNS) domain",
    schema: {
        name: z.string()
            .describe("The domain name to register (without .sui suffix)"),
        years: z.number().int().positive()
            .describe("Number of years to register the domain for"),
        payToken: z.enum(["SUI", "USDC", "NS"])
            .describe("Token symbol to pay with (SUI, USDC, or NS)")
    },
    handler: async (agent: Agent, input: Record<string, any>) => {
        try {
            const result = await agent.registerSns(
                input.name,
                input.years,
                input.payToken
            );

            return { 
                message: `Successfully registered ${input.name}.sui for ${input.years} year(s) using ${input.payToken}`,
                ...result
            };
        } catch (error: any) {
            throw new Error(`Failed to register SNS domain: ${error.message}`)
        }
    }
};