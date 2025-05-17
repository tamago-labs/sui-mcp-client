import { executeSuiCommand } from './executor';

export const getAddresses = async () => {
  return executeSuiCommand('client', ['addresses']);
};

export const getActiveAddress = async () => {
  return executeSuiCommand('client', ['active-address']);
};

export const switchAddress = async (address: string) => {
  return executeSuiCommand('client', ['switch', '--address', address]);
};