# Sui Butler

![NPM Version](https://img.shields.io/npm/v/sui-butler)

**Sui Butler** is a Model Context Protocol (MCP) server implementation for the Sui blockchain ecosystem that bridges AI intelligence for simplified development, DeFi portfolio management, seamless governance, and a variety of use cases through the comprehensive MCP tools we provide.

- [YouTube Demo](https://youtu.be/WmyxVXJUsdM) 
- [Website](https://sui-mcp.tamagolabs.com)
- [NPM Registry](https://www.npmjs.com/package/sui-serverless-mcp)
- [Backend Repo](https://github.com/tamago-labs/sui-serverless-mcp)

## Components
The system is composed of two subsystems:

- **Sui Butler Client** – (This repository) A Node.js TypeScript library designed to run inside MCP-compatible AI model clients such as Claude Desktop. It enables AI agents to interact with the Sui blockchain.
- **Sui Butler Backend** – The backend system built using the AWS Serverless Stack. It includes backend services and a dashboard for issuing access keys and managing transactions in zkLogin mode.

## Features

- Supports MCP-compatible clients like Claude Desktop with more integrations coming
- 20+ MCP tools covering account management, smart contract development, staking, token operations and market data
- Token swaps on Mainnet via the Cetus DEX Aggregator
- Pyth price oracle integration for real-time market data
- Sui CLI integration for smart contract development and testing
- Fully non-custodial, enables transactions using zkLogin wallets from the AI chat interface


## Using with Claude Desktop

There are two mode available: zkLogin (recommended for most new users) and Private Key (for advanced users).

### Private Key Mode ###

In Private Key mode, all operations (including transfers and other write operations) will be executed automatically without requiring additional approval.

1. Install Claude Desktop if you haven't already
2. Open Claude Desktop settings
3. Add the Sui MCP client to your configuration:

```
{
  "mcpServers": {
    "sui-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "sui-serverless-mcp",
        "--sui_private_key=YOUR_PRIVATE_KEY", 
        "--sui_network=mainnet"
      ],
      "disabled": false
    }
  }
}
```

Private Key mode is recommended for advanced users who can securely manage their private keys. The MCP client handles transactions locally without exposing any data to external servers.

### zkLogin Mode ###

With zkLogin authentication, read operations (balance checks, quotes) work immediately, but write operations (transfers, swaps) require explicit approval in the dashboard.

1. Install Claude Desktop if you haven't already
2. Open Claude Desktop settings
3. Add the Sui MCP client to your configuration:

```
{
  "mcpServers": {
    "sui-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "sui-serverless-mcp",
        "--sui_access_key=YOUR_ACCESS_KEY", 
        "--sui_network=mainnet"
      ],
      "disabled": false
    }
  }
}
```

The access key can be obtained from the dashboard. After logging in, a unique access key will be generated for each user.

### Comparison ###

Feature | zkLogin | Private Key 
--- | --- | ---
Security |  Higher - private key never exposed  | Lower - requires managing private key
Transaction Approval | Required for write operations | Automatic execution
Setup Complexity | Simple OAuth login |  Requires secure key management
Best For | Regular users, mobile usage | Developers, advanced users

## Key Use Cases

### 1. DeFi Portfolio Management with Real-Time Price Data
Butler connects to Pyth price oracles and external sources to help you:

- Monitor real-time cryptocurrency prices across multiple assets
- Compare prices across different platforms for optimal trading opportunities
- Execute token swaps on Cetus Aggregator at the most advantageous moment
- Track your portfolio performance and get AI-powered insights on market trends

*Example: "..."*

### 2. Smart Contract Development & Testing Assistance
Butler integrates with the Sui CLI to help developers:
- Analyze existing Move code and suggest improvements
- Generate comprehensive test cases for smart contracts
- Automatically execute tests and provide detailed reports
- Help debug issues with intelligent error analysis
- Publish and upgrade packages directly through AI conversation

*Example: "..."*

### 3. Protocol Governance & Parameter Management
Butler assists DeFi protocol managers with:

- Monitoring key market metrics to inform governance decisions
- Simulating parameter changes before implementation
- Updating protocol parameters like utilization ratios for lending protocols
- Analyzing the effects of parameter changes on protocol performance
- Managing governance proposals through simple conversations

*Example: "..."*

## Background

Today, when building AI applications—especially those focused on crypto, we often rely on agent kits based on Langchain. These kits tightly couple the AI model and components, requiring frequent updates, otherwise, the application risks becoming non-functional within a few months or even weeks.

Model Context Protocol (MCP), introduced by Claude AI in late 2024, has quickly become popular today. It solves this issue by integrating directly with AI interfaces, allowing users to easily switch to the latest models and interact with Web3 through standardized tools. 

## Available Tools

### Wallet & Network Operations
| Tool Name | Description | Example Usage |
|-----------|-------------|---------------|
| `sui_get_wallet_address` | Retrieve your wallet address | "What's my wallet address?" |
| `sui_get_all_balances` | Get all token balances | "Show my token balances" |

### Token Transfers & DeFi
| Tool Name | Description | Example Usage |
|-----------|-------------|---------------|
| `sui_transfer_token` | Transfer tokens to another address | "Transfer 10 SUI to 0x123..." |
| `sui_get_swap_quote` | Get a quote for swapping tokens | "Get quote for swapping 10 SUI to CETUS" |
| `sui_swap_tokens` | Swap tokens on Cetus Aggregator | "Swap 10 SUI to CETUS with 0.5% slippage" |

### Staking Operations
| Tool Name | Description | Example Usage |
|-----------|-------------|---------------|
| `sui_stake` | Stake SUI tokens to a validator | "Stake 100 SUI to validator X" |
| `sui_get_stake` | Get all staked SUI tokens | "Show my staked positions" |
| `sui_unstake` | Unstake SUI tokens | "Unstake my SUI from validator X" |

### Token Management
| Tool Name | Description | Example Usage |
|-----------|-------------|---------------|
| `sui_deploy_token` | Deploy a new token on Sui | "Create a token named MyToken with symbol MTK" |

### SNS Domain Services
| Tool Name | Description | Example Usage |
|-----------|-------------|---------------|
| `sui_get_sns_name_record` | Get SNS domain information | "Look up info about domain.sui" |
| `sui_register_sns` | Register a SNS domain | "Register myname.sui for 2 years" |

### Sui CLI Integration
| Tool Name | Description | Example Usage |
|-----------|-------------|---------------|
| `sui_cli_move_build` | Build a Move package | "Build my Move package" |
| `sui_cli_move_test` | Run Move unit tests | "Run tests for my smart contract" |
| `sui_cli_publish` | Publish a Move package | "Publish my package to testnet" |
| `sui_cli_active_env` | Get current network | "Which network am I connected to?" |

### Price Data (Pyth)
| Tool Name | Description | Example Usage |
|-----------|-------------|---------------|
| `pyth_search_price_feeds` | Search for price feeds | "Find BTC price feeds on Pyth" |
| `pyth_get_prices` | Get prices by feed IDs | "Get the latest BTC and ETH prices" |
| `pyth_get_common_crypto_prices` | Get common crypto prices | "What are the current prices for BTC, ETH, SOL and SUI?" |

## zkLogin Transaction Flow

When a user operates in zkLogin mode using an MCP-compatible AI client:

1. The client pushes a transaction request to the backend.

2. The transaction is stored in the database with a pending status.

3. The user can visit the dashboard to manually approve the transaction using their zkLogin-authenticated session.

## Troubleshooting

If you're using Ubuntu or another Linux environment with NVM, you'll need to manually configure the path. Follow these steps:

1. Install the MCP Client globally under your current NVM-managed Node.js version.

```
npm install -g sui-serverless-mcp
```

2. Due to how NVM installs libraries, you may need to use absolute paths in your config. Replace the example values below with your actual username and Node version:

```
{
  "mcpServers": {
    "sui-mcp": {
      "command": "/home/YOUR_NAME/.nvm/versions/node/YOUR_NODE_VERSION/bin/node",
      "args": [
        "/home/YOUR_NAME/.nvm/versions/node/YOUR_NODE_VERSION/bin/sui-serverless-mcp",
        "--sui_access_key=YOUR_ACCESS_KEY",
        "--sui_network=mainnet"
      ]
    }
  }
}
```

3. Restart Claude Desktop and it should work now.

## License
This project is licensed under the MIT License.

