import { GetSnsNameTool } from "./sns/get_sns_name_tool";
import { RegisterSnsTool } from "./sns/register_sns_name_tool";
import { DeployTokenTool } from "./sui/deploy_coin_tool";
import { GetAllTokenBalancesTool } from "./sui/get_all_balances_tool";
import { GetStakeTool } from "./sui/get_stake_tool";
import { GetWalletAddressTool } from "./sui/get_wallet_address_tool";
import { StakeSuiTool } from "./sui/stake_sui_tool";
import { TransferTokenTool } from "./sui/transfer_token_tool";
import { UnstakeSuiTool } from "./sui/unstake_sui_tool";


export const SuiMcpTools = {
    "GetSnsNameTool" : GetSnsNameTool,
    "RegisterSnsTool" : RegisterSnsTool,
    "DeployTokenTool" : DeployTokenTool,
    "GetAllTokenBalancesTool" : GetAllTokenBalancesTool,
    "GetStakeTool" : GetStakeTool,
    "GetWalletAddressTool" : GetWalletAddressTool,
    "StakeSuiTool" : StakeSuiTool,
    "TransferTokenTool": TransferTokenTool,
    "UnstakeSuiTool": UnstakeSuiTool
}