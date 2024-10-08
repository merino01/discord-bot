import { Collection } from "discord.js"
import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import logger from "../logger/logger.js"
import config from "../../config/config.js"
import CommandsMap from "../dictionaries/commands.js"
import { getSlashCommands } from "../slash-commands/slash-commands.js"

const { guild_id, client_id, token } = config

const start = (client) => {
	client.commands = new Collection()

	for (const [command, handler] of Object.entries(CommandsMap)) {
		try {
			client.commands.set(command, handler)
			logger.info(`Command loaded: '${command}'`)
		} catch (error) {
			logger.error(`Command: ${command} failed to load`)
			logger.error(error)
		}
	}
	logger.info(`${client.commands.size} commands loaded`)
}

const startSlashCommands = (client) => {
	client.slashCommands = new Collection()

	const _slashCommands = getSlashCommands()
	for (const [commandName, cmd] of Object.entries(_slashCommands)) {
		client.slashCommands.set(commandName, cmd.data.toJSON())
	}

	const rest = new REST({ version: "9" }).setToken(token)

	const load = async () => {
		try {
			await rest.put(
				Routes.applicationGuildCommands(client_id, guild_id),
				{ body: client.slashCommands }
			)
		} catch (error) {
			logger.error("Failed to load application (/) commands.")
			logger.error(error)
		}
	}
	load()
}

const CommandHandler = { start, startSlashCommands }
export default CommandHandler
