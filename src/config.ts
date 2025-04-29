#!/usr/bin/env node

import * as dotenv from 'dotenv';
import { SuiConfig } from './types';

dotenv.config();

const getArgs = () =>
    process.argv.reduce((args: any, arg: any) => {
        // long arg
        if (arg.slice(0, 2) === "--") {
            const longArg = arg.split("=");
            const longArgFlag = longArg[0].slice(2);
            const longArgValue = longArg.length > 1 ? longArg[1] : true;
            args[longArgFlag] = longArgValue;
        }
        // flags
        else if (arg[0] === "-") {
            const flags = arg.slice(1).split("");
            flags.forEach((flag: any) => {
                args[flag] = true;
            });
        }
        return args;
    }, {});

export function validateEnvironment(): void {

    const args = getArgs();

    const requiredEnvVars = {
        SUI_PRIVATE_KEY: args?.sui_private_key || process.env.SUI_PRIVATE_KEY,
        SUI_NETWORK: args?.sui_network || process.env.SUI_NETWORK,
    };

    const missingVars = Object.entries(requiredEnvVars)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

    if (missingVars.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missingVars.join(', ')}`
        );
    }
}

export function getSuiConfig(): SuiConfig {
    validateEnvironment();

    const args = getArgs();

    const currentEnv = {
        SUI_PRIVATE_KEY: args?.sui_private_key || process.env.SUI_PRIVATE_KEY,
        SUI_NETWORK: args?.sui_network || process.env.SUI_NETWORK,
    };

    return {
        privateKey: currentEnv.SUI_PRIVATE_KEY!,
        network: (currentEnv.SUI_NETWORK || 'testnet') as 'testnet' | 'mainnet',
    };
}