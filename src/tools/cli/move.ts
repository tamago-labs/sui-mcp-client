import { executeSuiCommand } from './executor';

export const buildMovePackage = async (path: string, options: { dev?: boolean, test?: boolean } = {}) => {
    const args = ['build'];

    if (path) args.push('--path', path);
    if (options.dev) args.push('--dev');
    if (options.test) args.push('--test');

    return executeSuiCommand('move', args);
};

export const testMovePackage = async (path: string, options: { filter?: string, coverage?: boolean } = {}) => {
    const args = ['test'];

    if (path) args.push('--path', path);
    if (options.filter) args.push('--filter', options.filter);
    if (options.coverage) args.push('--coverage');

    return executeSuiCommand('move', args);
};

export const createMovePackage = async (name: string, path?: string) => {
    const args = ['new', name];
    if (path) args.push(path);

    return executeSuiCommand('move', args);
};