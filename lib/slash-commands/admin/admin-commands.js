import {
	PermissionFlagsBits,
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
	SlashCommandSubcommandGroupBuilder
} from "discord.js"
import ClanesCommands from "./clanes/clanes.js"
import TriggersCommands from "./triggers/triggers.js"
import logger from "../../logger/logger.js"
import EchoCommand from "./echo.js"
import PingCommand from "./ping.js"
import LogsCommands from "./logs/logs.js"
import MessageFormatsCommands from "./message-formats/message-formats-commands.js"
import ChannelAutomaticMessages from "./channel-automatic-messages/channel-automatic-messages.js"

const subcommandGroups = {
	clanes: ClanesCommands,
	triggers: TriggersCommands,
	messageformats: MessageFormatsCommands,
	channelautomaticmessages: ChannelAutomaticMessages,
	logs: LogsCommands,
	echo: EchoCommand,
	ping: PingCommand
}

const data = new SlashCommandBuilder()
	.setName("admin")
	.setDescription("Comandos de administración")

for (const group in subcommandGroups) {
	const commandData = subcommandGroups[group].data
	if (commandData instanceof SlashCommandSubcommandGroupBuilder) {
		data.addSubcommandGroup(subcommandGroups[group].data)
	} else if (commandData instanceof SlashCommandSubcommandBuilder) {
		data.addSubcommand(subcommandGroups[group].data)
	}
}

const AdminCommands = {
	data,
	execute: async (interaction) => {
		const subcommandGroup = interaction.options.getSubcommandGroup()
		const subcommand = interaction.options.getSubcommand()

		try {
			if (subcommandGroups[subcommandGroup]) {
				logger.info(`Command: '${subcommandGroup} ${subcommand}'`)
				return await subcommandGroups[subcommandGroup].execute(interaction)
			} else if (subcommand in subcommandGroups) {
				logger.info(`Command: '${subcommand}'`)
				return await subcommandGroups[subcommand].execute(interaction)
			}
		} catch (error) {
			logger.error(error)
			if (interaction.deferred || interaction.replied) {
				return await interaction.editReply({
					content: "❌ Ha ocurrido un error al ejecutar el comando",
					ephemeral: true
				})
			}
			return await interaction.reply({
				content: "❌ Ha ocurrido un error al ejecutar el comando",
				ephemeral: true
			})
		}

		return await interaction.reply({
			content: "❗Comando no encontrado",
			ephemeral: true
		})
	}
}

export default AdminCommands
