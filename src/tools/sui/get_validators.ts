import { Agent } from "../../agent";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import BigNumber from "bignumber.js";

export interface ValidatorInfo {
    name: string;
    description: string;
    imageUrl: string;
    projectUrl: string;
    commissionRate: string;
    nextEpochStake: string;
    stakingPoolActivationEpoch: string;
    stakingPoolSuiBalance: string;
    suiAddress: string;
    validatorAddress: string;
    vol: string;
    apy: number;
}

export async function getValidators(
    agent: Agent,
    sortBy: 'apy' | 'stake' | 'commission' = 'stake',
    limit?: number
): Promise<ValidatorInfo[]> {

    try {
        // Use the existing client from agent or create a new one if needed
        const client = agent.client || new SuiClient({ url: getFullnodeUrl(agent.network) });

        // Get the latest Sui system state
        const data = await client.getLatestSuiSystemState();
        let validators: any = data.activeValidators;

        // Get APY data for validators
        const { apys } = await client.getValidatorsApy();

        // Process and enrich validator data
        validators = validators.map((item: any) => {
            const apyItem = apys.find(a => a.address.toLowerCase() === item.suiAddress.toLowerCase());
            const vol = (BigNumber(item.stakingPoolSuiBalance).minus(BigNumber(item.nextEpochStake)))
                .absoluteValue()
                .dividedBy(BigNumber(1000000000));

            return {
                name: item.name,
                description: item.description,
                imageUrl: item.imageUrl,
                projectUrl: item.projectUrl,
                commissionRate: item.commissionRate,
                nextEpochStake: item.nextEpochStake,
                stakingPoolActivationEpoch: item.stakingPoolActivationEpoch,
                stakingPoolSuiBalance: item.stakingPoolSuiBalance,
                suiAddress: item.suiAddress,
                validatorAddress: item.suiAddress,
                vol: `${vol}`,
                apy: apyItem ? Number(apyItem.apy) * 100 : 0
            };
        });

        // Sort validators based on the requested criteria
        switch (sortBy) {
            case 'apy':
                validators.sort((a: any, b: any) => b.apy - a.apy);
                break;
            case 'commission':
                validators.sort((a: any, b: any) => Number(a.commissionRate) - Number(b.commissionRate));
                break;
            case 'stake':
            default:
                validators.sort((a: any, b: any) =>
                    BigNumber(b.stakingPoolSuiBalance).minus(BigNumber(a.stakingPoolSuiBalance)).toNumber()
                );
                break;
        }

        // Apply limit if specified
        if (limit && limit > 0) {
            validators = validators.slice(0, limit);
        }

        return validators
    } catch (error: any) {

        throw new Error(`Failed to fetch validators: ${error.message}`);
    }
}
