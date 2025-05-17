import { z } from "zod";
import { Agent } from "../../agent";
import { type McpTool } from "../../types";
import { getActiveEnvironment, listEnvironments, switchEnvironment } from "../../tools/cli/network";

export const GetActiveEnvironmentTool: McpTool = {
    name: "sui_cli_active_env",
    description: "Get the currently active Sui network environment (mainnet, testnet, devnet)",
    schema: {},
    handler: async (agent: Agent, input: Record<string, any>) => {
        const result = await getActiveEnvironment();

        if (!result.success) {
            return {
                status: "error",
                message: result.stderr
            };
        }

        // Extract just the environment name from the output
        // The output is typically in the format "Active environment: [testnet]"
        const output = result.stdout.trim();
        let activeEnv = output;

        // Try to extract just the environment name
        const match = output.match(/Active environment: \[(\w+)\]/i);
        if (match && match[1]) {
            activeEnv = match[1].toLowerCase(); // mainnet, testnet, devnet, etc.
        }

        return {
            status: "success",
            activeEnvironment: activeEnv,
            rawOutput: output
        };
    },
};

export const ListEnvironmentsTool: McpTool = {
    name: "sui_cli_envs",
    description: "List all available Sui network environments",
    schema: {},
    handler: async (agent: Agent, input: Record<string, any>) => {
        const result = await listEnvironments();

        if (!result.success) {
            return {
                status: "error",
                message: result.stderr
            };
        }

        return {
            status: "success",
            environments: result.stdout
        };
    },
};

export const SwitchEnvironmentTool: McpTool = {
    name: "sui_cli_switch_env",
    description: "Switch to a different Sui network environment",
    schema: {
        environment: z.string().describe("The environment alias to switch to (e.g., mainnet, testnet, devnet)")
    },
    handler: async (agent: Agent, input: Record<string, any>) => {
        const result = await switchEnvironment(input.environment);

        if (!result.success) {
            return {
                status: "error",
                message: result.stderr
            };
        }

        return {
            status: "success",
            message: result.stdout
        };
    },
};