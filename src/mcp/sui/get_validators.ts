
import { z } from "zod";
import { Agent } from "../../agent"
import { type McpTool } from "../../types";

export const GetValidatorsTool: McpTool = {
    name: "sui_get_validators",
    description: "Get a list of active validators with their staking information, APY, and commission rates",
    schema: {
        sortBy: z.enum(['apy', 'stake', 'commission']).optional()
            .describe("Sort validators by APY, total stake, or commission rate (default: stake)"),
        limit: z.number().int().positive().optional()
            .describe("Limit the number of validators returned (optional)")
    },
    handler: async (agent: Agent, input: Record<string, any>) => {
        try {
            const validators = await agent.getValidators(
                input.sortBy || 'stake',
                input.limit
            );

            // Format the response for better readability
            const topValidators = validators.slice(0, 10).map(v => ({
                name: v.name,
                validatorAddress: v.suiAddress,
                // stakingPoolId: v.stakingPoolId,
                apy: `${v.apy.toFixed(2)}%`,
                commission: `${(Number(v.commissionRate) / 100).toFixed(2)}%`,
                totalStake: `${(Number(v.stakingPoolSuiBalance) / 1000000000).toFixed(2)} SUI`,
                description: v.description
            }));

            return {
                status: "success",
                message: `Found ${validators.length} active validators.`,
                totalValidators: validators.length,
                topValidators,
                fullValidatorList: validators
            };
        } catch (error: any) {
            throw new Error(`Failed to get validators: ${error.message}`)
        }
    }
};