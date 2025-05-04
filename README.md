# Sui Serverless MCP

![NPM Version](https://img.shields.io/npm/v/sui-serverless-mcp)
  
Sui Serverless MCP is a Model Context Protocol (MCP) server implementation for the Sui blockchain that leverages zkLogin authentication. It enables AI assistants supporting the Model Context Protocol to securely interact with the Sui ecosystem, allowing users to perform a wide range of on-chain operations without needing to write code or understand technical details.

- [YouTube Demo](https://youtu.be/WmyxVXJUsdM) 
- [Application](https://sui-mcp.tamagolabs.com)
- [NPM Registry](https://www.npmjs.com/package/sui-serverless-mcp)
- [Core Repo](https://github.com/tamago-labs/sui-serverless-mcp)

## Components

The system is composed of two subsystems across two repositories:

- **[Sui Serverless MCP Client](https://github.com/tamago-labs/sui-mcp-client)** – (This repository)
A Node.js TypeScript library designed to run inside MCP-compatible AI model clients such as Claude Desktop. It enables AI agents to interact with the Sui blockchain.

- **[Sui Serverless MCP Core](https://github.com/tamago-labs/sui-serverless-mcp)** – The backend system is built using the AWS Serverless Stack. It includes backend services and a dashboard for issuing access keys and managing transactions in zkLogin mode

## Features

- Supports MCP-compatible clients like Claude Desktop. Many more are being developed.

- 10+ MCP tools covering account management, token operations, and staking.

- Token swaps on Mainnet via the Cetus DEX Aggregator.

- Fully non-custodial, enables transactions using zkLogin wallets from the AI chat interface.

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


## Background

Today, when building AI applications—especially those focused on crypto, we often rely on agent kits based on Langchain. These kits tightly couple the AI model and components, requiring frequent updates, otherwise, the application risks becoming non-functional within a few months or even weeks.

Model Context Protocol (MCP), introduced by Claude AI in late 2024, has quickly become popular today. It solves this issue by integrating directly with AI interfaces, allowing users to easily switch to the latest models and interact with Web3 through standardized tools. 

## Available Tools

The following tools are available in the current version, allowing you to perform various on-chain operations directly from your favorite AI chat panel:

### Wallet Operations

| Tool Name | Description | Example Usage |
|-----------|-------------|---------------|
| `sui_get_wallet_address` | Retrieve your wallet address | "What's my wallet address for Sui?" |
| `sui_get_all_balances` | Get all token balances | "Show my token balances" |

### Token Transfers

| Tool Name | Description | Example Usage |
|-----------|-------------|---------------|
| `sui_transfer_token` | Transfer tokens to another address | "Transfer 10 SUI to domain.sui" |

### Staking Operations

| Tool Name | Description | Example Usage |
|-----------|-------------|---------------|
| `sui_stake` | Stake SUI tokens to a validator | "Stake 100 SUI to validator 0x1234" |
| `sui_get_stake` | Get all staked SUI tokens | "Show my staked positions" |
| `sui_unstake` | Unstake SUI tokens | "Unstake my SUI on this staked sui 0x4567" |

### Token Management

| Tool Name | Description | Example Usage |
|-----------|-------------|---------------|
| `sui_deploy_token` | Deploy a new token on Sui | "Create a token named MyToken with symbol MTK" |

### SNS Domain Services

| Tool Name | Description | Example Usage |
|-----------|-------------|---------------|
| `sui_get_sns_name_record` | Get SNS domain information | "Look up info about domain.sui" |
| `sui_register_sns` | Register a SNS domain | "Register myname.sui for 2 years" |

### DeFi Operations

| Tool Name | Description | Example Usage |
|-----------|-------------|---------------|
| `sui_get_swap_quote` | Get a quote for swapping tokens | "If I want to swap 10 SUI for NAVI, how much NAVI will I get?" |
| `sui_swap_tokens` | Swap tokens on Cetus Aggregator | "Swap 10 SUI to NAVI now" |

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

