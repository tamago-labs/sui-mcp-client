import { executeSuiCommand } from './executor';

/**
 * Gets the currently active Sui network environment
 * @returns Result with the active environment (mainnet, testnet, devnet)
 */
export const getActiveEnvironment = async () => {
  return executeSuiCommand('client', ['active-env']);
};

/**
 * Lists all available Sui network environments
 * @returns Result with all configured environments
 */
export const listEnvironments = async () => {
  return executeSuiCommand('client', ['envs']);
};

/**
 * Switches to a different network environment
 * @param env Environment name (alias) to switch to
 * @returns Result of the switch operation
 */
export const switchEnvironment = async (env: string) => {
  return executeSuiCommand('client', ['switch', '--env', env]);
};