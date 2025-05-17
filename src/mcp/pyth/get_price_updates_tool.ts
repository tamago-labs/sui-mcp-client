import { z } from "zod";
import { Agent } from "../../agent";
import { type McpTool } from "../../types";
import { getLatestPriceUpdates } from "../../tools/pyth/price";

export const GetPriceUpdatesTool: McpTool = {
    name: "pyth_get_prices",
    description: "Get the latest price updates from Pyth for the provided price feed IDs",
    schema: {
        priceIds: z.array(z.string()).describe("Array of price feed IDs")
    },
    handler: async (agent: Agent, input: Record<string, any>) => {
        const result = await getLatestPriceUpdates(input.priceIds);

        if (!result.success) {
            return {
                status: "error",
                message: result.error
            };
        }

        return {
            status: "success",
            prices: result.prices
        };
    },
};

// Convenience tool for common crypto prices
export const GetCommonCryptoPricesTool: McpTool = {
    name: "pyth_get_common_crypto_prices",
    description: "Get the latest price updates for common cryptocurrencies (BTC, ETH, SOL, SUI)",
    schema: {},
    handler: async (agent: Agent, input: Record<string, any>) => {
        // Common price feed IDs
        const commonPriceIds = [
            "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43", // BTC/USD
            "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace", // ETH/USD
            "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d", // SOL/USD
            "0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65744"  // SUI/USD
        ];

        const result = await getLatestPriceUpdates(commonPriceIds);

        if (!result.success) {
            return {
                status: "error",
                message: result.error
            };
        }

        return {
            status: "success",
            prices: result.prices
        };
    },
};