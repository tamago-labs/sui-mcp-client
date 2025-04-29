import { SuinsClient } from "@mysten/suins"
import { Agent } from "../../agent"
import { NameRecord } from "@mysten/suins/dist/cjs/types";

export const getNameRecord = async (
    agent: Agent,
    name: string
): Promise<NameRecord | undefined> => {

    const suinsClient = new SuinsClient({
        client: agent.client as any,
        network: agent.network
    });

    // Modify name following suins
    name = name.toLowerCase();
    if (!name.endsWith(".sui")) {
        name = name + ".sui";
    }

    const nameRecord = await suinsClient.getNameRecord(name);
    if (!nameRecord) {
        return undefined;
    }

    return nameRecord
}