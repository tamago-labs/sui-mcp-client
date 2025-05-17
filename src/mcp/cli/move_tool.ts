import { z } from "zod";
import { Agent } from "../../agent";
import { type McpTool } from "../../types";
import { buildMovePackage, testMovePackage, createMovePackage } from "../../tools/cli/move";

export const BuildMovePackageTool: McpTool = {
  name: "sui_cli_move_build",
  description: "Build a Move package",
  schema: {
    path: z.string().optional().describe("Path to the package (defaults to current directory)"),
    dev: z.boolean().optional().describe("Whether to build in dev mode"),
    test: z.boolean().optional().describe("Whether to build in test mode")
  },
  handler: async (agent: Agent, input: Record<string, any>) => {
    const result = await buildMovePackage(input.path || ".", {
      dev: input.dev,
      test: input.test
    });
    
    if (!result.success) {
      return {
        status: "error",
        message: result.stderr
      };
    }
    
    return {
      status: "success",
      output: result.stdout
    };
  },
};

export const TestMovePackageTool: McpTool = {
  name: "sui_cli_move_test",
  description: "Run Move unit tests",
  schema: {
    path: z.string().optional().describe("Path to the package (defaults to current directory)"),
    filter: z.string().optional().describe("Filter for test names"),
    coverage: z.boolean().optional().describe("Whether to generate test coverage")
  },
  handler: async (agent: Agent, input: Record<string, any>) => {
    const result = await testMovePackage(input.path || ".", {
      filter: input.filter,
      coverage: input.coverage
    });
    
    if (!result.success) {
      return {
        status: "error",
        message: result.stderr
      };
    }
    
    return {
      status: "success",
      output: result.stdout
    };
  },
};

export const CreateMovePackageTool: McpTool = {
  name: "sui_cli_move_new",
  description: "Create a new Move project",
  schema: {
    name: z.string().describe("Name of the project"),
    path: z.string().optional().describe("Path where to create the project")
  },
  handler: async (agent: Agent, input: Record<string, any>) => {
    const result = await createMovePackage(input.name, input.path);
    
    if (!result.success) {
      return {
        status: "error",
        message: result.stderr
      };
    }
    
    return {
      status: "success",
      output: result.stdout
    };
  },
};