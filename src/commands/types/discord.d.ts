import type { Collection } from "discord.js";
import type pingCommand from "../utility/PingPong.js";

declare module "discord.js" {
    interface Client {
        commands: Collection<string, typeof pingCommand>;
    }
}