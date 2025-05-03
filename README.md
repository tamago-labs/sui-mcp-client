# Sui Serverless MCP
  
Sui Serverless MCP is a Model Context Protocol (MCP) server implementation for the Sui blockchain that leverages zkLogin authentication. It enables AI assistants supporting the Model Context Protocol to securely interact with the Sui ecosystem, allowing users to perform a wide range of on-chain operations without needing to write code or understand technical details.

## Components

The system is composed of two subsystems across two repositories:

- **[Sui Serverless MCP Client](https://github.com/tamago-labs/sui-mcp-client)** – (This repository)
A Node.js TypeScript library designed to run inside MCP-compatible AI model clients such as Claude Desktop. It enables AI agents to interact with the Sui blockchain.

- **[Sui Serverless MCP Core](https://github.com/tamago-labs/sui-serverless-mcp)** – The backend system is built using the AWS Serverless Stack. It includes backend services and a dashboard for issuing access keys and managing transactions in zkLogin mode

## Features

- Supports MCP-compatible AI clients, including Claude Desktop

- 10+ MCP tools covering account management, token operations, and staking

- Token swaps via the Cetus DEX Aggregator

- Fully non-custodial — no private keys are ever exposed to any server 

- Will be more powerful with other MCP tools like the filesystem, github, this allows AI to access your directory and automate tasks both within and outside of Web3.

## Using with Claude Desktop

### Quick Setup

1. **Get Your Access Key**
   - Sign in with zkLogin on the [Sui zkMCP dashboard](https://zkmcp.sui.io)
   - Copy your access key from the dashboard

2. **Configure Claude Desktop**
   - Create a JSON file named `sui-zkmcp-config.json` with the following:
   ```json
   {
     "mcpServers": {
       "sui": {
         "command": "npx",
         "args": [
           "-y",
           "sui-zkmcp",
           "--sui_access_key=YOUR_ACCESS_KEY", 
           "--sui_network=testnet"
         ],
         "disabled": false
       }
     }
   }


## Overview

Blockchain interactions have traditionally required technical knowledge and specialized interfaces. Sui zkMCP bridges this gap by allowing users to interact with the Sui blockchain through familiar conversational AI interfaces like Claude Desktop.

The project provides two authentication methods:
- **zkLogin Method**: Enhanced security using OAuth providers (Google, Facebook, etc.) with zero-knowledge proofs, requiring explicit approval for transactions
- **Private Key Method**: Direct access with full transaction control for developers and advanced users

By implementing the Model Context Protocol, Sui zkMCP creates a seamless connection between AI assistants and blockchain functionality, democratizing access to Web3.

## Features

### Wallet Management
Check your wallet address and token balances with simple natural language commands.
> "What's my wallet address?" • "Show my token balances"

### Token Transfers
Send SUI and other tokens to any address securely through conversational commands.
> "Transfer 5 SUI to 0x123..." • "Send 10 USDC to Bob's wallet"

### DeFi Swaps
Swap tokens using Cetus Aggregator for optimal rates across multiple liquidity sources.
> "Swap 10 SUI to CETUS" • "Get quote for exchanging 5 USDC to USDT"

### Staking Management
Stake and unstake SUI tokens with validators to earn rewards and participate in consensus.
> "Stake 100 SUI to validator X" • "Show my staked positions" • "Unstake my SUI"

### SNS Domains
Register and manage Sui Name Service domains through simple conversational interactions.
> "Register myname.sui for 2 years" • "Look up info about domain.sui"

### Token Creation
Deploy your own tokens on Sui blockchain with customizable parameters and supply.
> "Create a token named MyToken with symbol MTK" • "Deploy a fixed supply token"

### DeFi Market Data
Get real-time quotes and exchange rates for tokens on various Sui DeFi protocols.
> "What's the rate for SUI to CETUS?" • "Check price impact for large swap"

### Flexible Authentication
Choose between secure zkLogin authentication or direct private key access for advanced users.
> "OAuth login with Google" • "Configure with private key for full control"

### Validator Insights
View validator performance, APY rates, and find the best staking opportunities.
> "List top validators by APY" • "Show validator X's performance"
