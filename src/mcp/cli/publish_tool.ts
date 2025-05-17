import { z } from "zod";
import { Agent } from "../../agent";
import { type McpTool } from "../../types";
import { publishPackage, callMoveFunction } from "../../tools/cli/publish";

export const PublishPackageTool: McpTool = {
  name: "sui_cli_publish",
  description: "Publish a Move package to the blockchain",
  schema: {
    path: z.string().describe("Path to the package directory"),
    gasBudget: z.string().optional().describe("Gas budget for the transaction")
  },
  handler: async (agent: Agent, input: Record<string, any>) => {
    const result = await publishPackage(input.path, input.gasBudget);
    
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

export const CallMoveFunctionTool: McpTool = {
  name: "sui_cli_call",
  description: "Call a Move function",
  schema: {
    package: z.string().describe("Package ID"),
    module: z.string().describe("Module name"),
    function: z.string().describe("Function name"),
    typeArgs: z.string().optional().describe("Type arguments (comma-separated)"),
    args: z.array(z.string()).optional().describe("Function arguments"),
    gasBudget: z.string().optional().describe("Gas budget for the transaction")
  },
  handler: async (agent: Agent, input: Record<string, any>) => {
    const result = await callMoveFunction(
      input.package, 
      input.module, 
      input.function, 
      input.typeArgs,
      input.args,
      input.gasBudget
    );
    
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