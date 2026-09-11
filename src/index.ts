import "dotenv/config";
import "node:fs"
import { Client, SlashCommandBuilder, REST, Routes } from "discord.js";
import pingCommand from "./commands/utility/PingPong.js";

const discordToken = process.env.DISCORD_TOKEN;
if (!discordToken) {throw new Error("No Discord Token!")}

const client = new Client({
    intents: ["Guilds", "GuildMessages", "GuildMembers", "MessageContent"],
});

client.on("clientReady", async (c) => {
    console.log(`${c.user.username} is online!`);

    const rest = new REST({ version: "10" }).setToken(discordToken);

});



client.login(discordToken);

