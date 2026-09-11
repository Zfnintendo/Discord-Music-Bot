// imports //
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Client, MessageFlags, Collection, Events} from "discord.js";
import pingCommand from "./commands/utility/PingPong.js";
// imports

// tokens //
const discordToken = process.env.DISCORD_TOKEN;
if (!discordToken) {throw new Error("No Discord Token!")}
// tokens

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

// Client actions //
client.on("clientReady", async (c) => {
    console.log(`${c.user.username} is online!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return; 
    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
		return;
    }

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
		} else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
		}
	}
});

// Client Actions //

// login client //
client.login(discordToken);
// login client //

