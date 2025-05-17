import { z } from "zod";
import { Agent } from "../../agent";
import { type McpTool } from "../../types";
import { searchPriceFeeds } from "../../tools/pyth/price";

export const SearchPriceFeedsTool: McpTool = {
    name: "pyth_search_price_feeds",
    description: "Search for Pyth price feeds by query and asset type",
    schema: {
        query: z.string().describe("Search query (e.g., 'btc', 'eth', 'sol')"),
        assetType: z.string().optional().describe("Asset type (e.g., 'crypto', 'equity', 'fx', 'metal', 'rates', 'crypto_redemption_rate')")
    },
    handler: async (agent: Agent, input: Record<string, any>) => {
        const result = await searchPriceFeeds(input.query, input.assetType);

        if (!result.success) {
            return {
                status: "error",
                message: result.error
            };
        }

        // Format the results for better readability
        const formattedFeeds = result.priceFeeds ? result.priceFeeds.map(feed => ({
            id: feed.id,
            symbol: feed.attributes?.display_symbol || 'Unknown',
            baseCurrency: feed.attributes?.base || 'Unknown',
            quoteCurrency: feed.attributes?.quote_currency || 'Unknown',
            assetType: feed.attributes?.asset_type || 'Unknown'
        })) : []

        return {
            status: "success",
            priceFeeds: formattedFeeds,
            count: formattedFeeds.length
        };
    },
};