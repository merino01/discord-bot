import { Client, GatewayIntentBits } from "discord.js"
import config from "./config/config.js"
import EventHandler from "./lib/handlers/events.js"
import CommandHandler from "./lib/handlers/commands.js"
import { createTables } from "./lib/database/database.js"
import sendMessageToAdmin from "./utils/send-message-to-admin.js"
import api from "./lib/api/api.js"

const { token } = config

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMembers
	]
})

await createTables()
EventHandler.start(client)
CommandHandler.start(client)
CommandHandler.startSlashCommands(client)
api.start(client)

client.login(token)

process.on("unhandledRejection", (error) => {
	sendMessageToAdmin(
		`ERROR. "${error.message || error}". Por favor, revise el log para más detalles.`
	)
})

process.on("uncaughtException", (error) => {
	sendMessageToAdmin(
		`ERROR. "${error.message || error}". Por favor, revise el log para más detalles.`
	)
})
