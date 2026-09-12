// imports //
import dotenv from "dotenv";
dotenv.config();

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Client, Collection} from "discord.js";
import pingCommand from "./commands/utility/PingPong.js";
// imports //

// tokens //
const discordToken = process.env.DISCORD_TOKEN;
if (!discordToken) {throw new Error("No Discord Token!")}
// tokens //

// Client Setup //
const client = Object.assign(
    new Client({
        intents: ["Guilds", "GuildMessages", "GuildMembers", "MessageContent"],
    }),
    {
        commands: new Collection<string, typeof pingCommand>(),
    },
);
// Client Setup //

// Commands //
const foldersPath = fileURLToPath(new URL("./commands/", import.meta.url));
const commandFolders = fs.readdirSync(foldersPath, { withFileTypes: true });
const extension = import.meta.url.endsWith(".ts") ? ".ts" : ".js";

for (const folder of commandFolders) {
    if (!folder.isDirectory()) continue;
    
    const commandsPath = path.join(foldersPath, folder.name);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(extension) && !file.endsWith(".d.ts"));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const { default: command } = await import(
            pathToFileURL(filePath).href
        );

        if (command?.data && typeof command.execute === "function") {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}
// Commands //

// Client events //
const eventsPath = fileURLToPath(new URL("events", import.meta.url));
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(extension) && !file.endsWith(".d.ts"));
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const { default: event } = await import(pathToFileURL(filePath).href);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
// Client Actions //

// login client //
client.login(discordToken);
// login client //

