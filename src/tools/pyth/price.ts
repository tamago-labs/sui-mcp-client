import { HermesClient } from "@pythnetwork/hermes-client";

/**
 * Search for price feeds by query and asset type
 * @param query Search query (e.g., "btc")
 * @param assetType Asset type (e.g., "crypto", "equity", "fx", "metal", "rates")
 * @returns List of matching price feeds
 */
export const searchPriceFeeds = async (query: string, assetType?: string) => {
    try {
        const client = new HermesClient("https://hermes.pyth.network", {});
        const priceFeeds = await client.getPriceFeeds({
            query,
            assetType: assetType as any,
        });

        return {
            success: true,
            priceFeeds
        };
    } catch (error: any) {
        console.error('Error searching price feeds:', error);
        return {
            success: false,
            error: error.message || 'Failed to search price feeds'
        };
    }
};

/**
 * Get latest price updates for the provided price feed IDs
 * @param priceIds Array of price feed IDs
 * @returns Latest price updates
 */
export const getLatestPriceUpdates = async (priceIds: string[]) => {
    try {
        const client = new HermesClient("https://hermes.pyth.network", {});
        const priceUpdates = await client.getLatestPriceUpdates(priceIds);

        // Format the price data for better readability
        const formattedPrices = priceUpdates.parsed ? priceUpdates.parsed.map((update) => {

            let price = 1

            if (update.ema_price.expo > 0) {
                price = Number(update.ema_price.price) * (10 ** Math.abs(update.ema_price.expo))
            } else {
                price = Number(update.ema_price.price) / (10 ** Math.abs(update.ema_price.expo))
            }

            return {
                id: update.id,
                price: price || null,
                publishTime: update.ema_price ? new Date(update.ema_price.publish_time * 1000).toISOString() : null,

            };
        }) : []

        return {
            success: true,
            prices: formattedPrices,
            // rawUpdates: priceUpdates
        };
    } catch (error: any) {
        console.error('Error getting price updates:', error);
        return {
            success: false,
            error: error.message || 'Failed to get price updates'
        };
    }
};