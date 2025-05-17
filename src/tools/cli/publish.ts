import { executeSuiCommand } from './executor';

export const publishPackage = async (path: string, gasBudget?: string) => {
  const args = ['publish', path];
  
  if (gasBudget) args.push('--gas-budget', gasBudget);
  
  return executeSuiCommand('client', args);
};

export const callMoveFunction = async (
  packageId: string, 
  module: string, 
  func: string, 
  typeArgs?: string,
  args?: string[],
  gasBudget?: string
) => {
  const cmdArgs = ['call', '--package', packageId, '--module', module, '--function', func];
  
  if (typeArgs) cmdArgs.push('--type-args', typeArgs);
  if (args && args.length > 0) {
    cmdArgs.push('--args');
    cmdArgs.push(...args);
  }
  if (gasBudget) cmdArgs.push('--gas-budget', gasBudget);
  
  return executeSuiCommand('client', cmdArgs);
};