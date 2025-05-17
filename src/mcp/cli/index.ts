import { ListAddressesTool, GetActiveAddressTool, SwitchAddressTool } from './addresses_tool';
import { GetActiveEnvironmentTool, ListEnvironmentsTool, SwitchEnvironmentTool } from './network_tool';
import { BuildMovePackageTool, TestMovePackageTool, CreateMovePackageTool } from './move_tool';
import { PublishPackageTool, CallMoveFunctionTool } from './publish_tool';

export const CliTools = {
    "ListAddressesTool": ListAddressesTool,
    "GetActiveAddressTool": GetActiveAddressTool,
    "SwitchAddressTool": SwitchAddressTool,
    "GetActiveEnvironmentTool": GetActiveEnvironmentTool,
    "ListEnvironmentsTool": ListEnvironmentsTool,
    "SwitchEnvironmentTool": SwitchEnvironmentTool,
    "BuildMovePackageTool": BuildMovePackageTool,
    "TestMovePackageTool": TestMovePackageTool,
    "CreateMovePackageTool": CreateMovePackageTool,
    "PublishPackageTool": PublishPackageTool,
    "CallMoveFunctionTool": CallMoveFunctionTool
};