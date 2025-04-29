
import { z } from "zod";
import { Agent } from "../../agent" 
import { type McpTool } from "../../types";

export const GetSnsNameTool: McpTool = {
    name: "sui_get_sns_name_record",
    description: "Get information about a registered Sui Name Service (SNS) domain",
    schema: {
        name: z.string()
            .describe("The domain name to look up (e.g., 'example.sui')")
    },
    handler: async (agent: Agent, input: Record<string, any>) => {

        const nameRecord: any = await agent.getSnsNameRecord(input.name);

        // Convert timestamp to human readable format
        let humanReadableTime = "Unknown";
        let originalTimestamp = "";

        if (nameRecord && nameRecord.expirationTimestampMs) {
            const expirationDate = new Date(nameRecord.expirationTimestampMs);
            humanReadableTime = expirationDate.toLocaleString();
            originalTimestamp = `${nameRecord.expirationTimestampMs}`;

            // Replace the timestamp with formatted version
            nameRecord.expirationTimestamp = `${humanReadableTime} (${originalTimestamp} ms)`;
        }

        return {
            status: "success",
            ...nameRecord
        };
    },
}