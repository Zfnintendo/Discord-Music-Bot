import { REST, Routes, type RESTPutAPIApplicationCommandsResult} from "discord.js";
import dotenv from "dotenv";
dotenv.config();
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// .env stuff
const token = process.env.DISCORD_TOKEN;
if (!token) {throw new Error("No Discord Token!")}
const clientId = process.env.DISCORD_CLIENT_ID;
if (!clientId) {throw new Error("No client id!")}

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = fileURLToPath(new URL("./", import.meta.url));
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = (await rest.put(Routes.applicationCommands(clientId), { body: commands })) as RESTPutAPIApplicationCommandsResult;

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();