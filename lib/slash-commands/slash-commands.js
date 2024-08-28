import { SlashCommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js"
import logger from "../logger/logger.js"
import AutomaticMessagesCommands from "./admin/automatic-messages/automatic-messages.js"
import MessagesFormats from "./admin/message-formats/messages-formats.js"
import TriggersCommands from "./admin/triggers/triggers.js"
import AdminClanesCommands from "./admin/clanes/clanes.js"
import LogsCommand from "./admin/logs.js"
import EchoCommand from "./admin/echo.js"
import PingCommand from "./admin/ping.js"
import ClanCommands from "./users/clan/clan-commands.js"
import LogsConfig from "../../config/logs.config.js"
import { getChannel } from "../../utils/discord-api/channels.js"
import { createEmbed } from "../../utils/discord-api/components.js"
import { COLORS } from "../../enums/colors.js"

const SlashCommands = {
	admin: {
		echo: EchoCommand,
		ping: PingCommand,
		automaticmessages: {
			info: AutomaticMessagesCommands.info,
			create: AutomaticMessagesCommands.create,
			delete: AutomaticMessagesCommands.delete
		},
		messagesformats: {
			info: MessagesFormats.info,
			create: MessagesFormats.create,
			delete: MessagesFormats.delete
		},
		triggers: {
			info: TriggersCommands.info,
			create: TriggersCommands.create,
			delete: TriggersCommands.delete
		},
		clanes: {
			info: AdminClanesCommands.info,
			create: AdminClanesCommands.create,
			delete: AdminClanesCommands.delete,
			updatetextcategory: AdminClanesCommands.updatetextcategory,
			updatevoicecategory: AdminClanesCommands.updatevoicecategory,
			addadditionalrole: AdminClanesCommands.addadditionalrole,
			removeadditionalrole: AdminClanesCommands.removeadditionalrole,
			addliderrole: AdminClanesCommands.addliderrole,
			archive: AdminClanesCommands.archive,
			addvoicechannel: AdminClanesCommands.addvoicechannel
		},
		logs: LogsCommand
	},
	clan: {
		info: ClanCommands.info,
		add: ClanCommands.add,
		kick: ClanCommands.kick,
		leave: ClanCommands.leave,
		addlider: ClanCommands.addlider,
		removelider: ClanCommands.removelider
	}
}

export const getSlashCommands = () => {
	let loadedCommands = 0
	const _slashCommands = {}

	const commands = getCommands()
	for (const commandName of commands) {
		const command = {}

		const commandData = new SlashCommandBuilder()
			.setName(commandName)
			.setDescription(`Comandos de ${commandName}`)

		const subcommands = getSubcommands({ command: commandName })
		if (subcommands.length === 0) {
			command.data = commandData
			_slashCommands[commandName] = command
			logger.info(`Slash command loaded: '/${commandName}'`)
			loadedCommands++
			continue
		}

		for (const subcommand of subcommands) {
			const subcommandName = subcommand.name
			const fullCommandName = `/${commandName} ${subcommandName}`
			commandData.addSubcommand(subcommand.data)
			command.data = commandData

			logger.info(`Slash command loaded: '${fullCommandName}'`)
			loadedCommands++
		}

		const subcommandGroups = getSubcommandGroups(commandName)
		for (const subcommandGroup of subcommandGroups) {
			const subcommandGroupName = subcommandGroup.name
			const groupData = new SlashCommandSubcommandGroupBuilder()
				.setName(subcommandGroupName)
				.setDescription(`Comandos de ${subcommandGroupName}`)

			const groupsubcommands = getSubcommands({
				command: commandName,
				commandGroup: subcommandGroupName
			})
			for (const _sub of groupsubcommands) {
				const subcommandName = _sub.name
				const fullCommandName = `/${commandName} ${subcommandGroupName} ${subcommandName}`
				groupData.addSubcommand(_sub.data)

				logger.info(`Slash command loaded: '${fullCommandName}'`)
				loadedCommands++
			}
			commandData.addSubcommandGroup(groupData)
			command.data = commandData
		}

		_slashCommands[commandName] = command
	}
	logger.info(`${loadedCommands} slash commands loaded`)
	return _slashCommands
}

// eslint-disable-next-line complexity
export const executeSlashCommands = async (interaction) => {
	const subcommandGroup = interaction.options.getSubcommandGroup(false)
	const subcommand = interaction.options.getSubcommand(false)
	const command = interaction.commandName

	try {
		const fullCommand = `/${command}${subcommandGroup
			? ` ${subcommandGroup}`
			: ""}${subcommand
			? ` ${subcommand}`
			: ""}`
		logger.info(`Executing command: '${fullCommand}' by user: `+
      `'${interaction.user.tag}' (${interaction.user.id})`)

		await logCommandToChannel({ command: fullCommand, userId: interaction.user.id })

		let cmd = null
		if (!subcommand && !subcommandGroup) {
			cmd = SlashCommands[command]
		} else if (subcommandGroup && subcommand) {
			cmd = SlashCommands[command][subcommandGroup][subcommand]
		} else if (!subcommandGroup && subcommand) {
			cmd = SlashCommands[command][subcommand]
		}
		if (!cmd) { return }

		const { ephemeral, defer } = cmd
		if (defer) {
			await interaction.deferReply({ ephemeral })
		}
		const response = await cmd.execute(interaction)
		if (Array.isArray(response)) {
			if (defer) {
				await interaction.editReply(response[0])
				for (let i = 1; i < response.length; i++) {
					await interaction.followUp({ ...response[i], ephemeral })
				}
			} else {
				await interaction.reply(response[0])
				for (let i = 1; i < response.length; i++) {
					await interaction.followUp({ ...response[i], ephemeral })
				}
			}
		}

		if (interaction.deferred || interaction.replied) {
			return await interaction.editReply({ ...response, ephemeral })
		}
		return await interaction.reply({ ...response, ephemeral })
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
}

function getCommands () {
	return Object.keys(SlashCommands)
}

function getSubcommands ({ command, commandGroup }) {
	if (!commandGroup) {
		return Object.entries(SlashCommands[command])
			.filter(([, _c]) => _c && "data" in _c)
			.map(([key, value]) => ({
				name: key,
				data: value.data
			}))
	}

	return Object.entries(SlashCommands[command][commandGroup])
		.filter(([, _c]) => _c && "data" in _c)
		.map(([key, value]) => ({
			name: key,
			data: value.data
		}))
}

function getSubcommandGroups (command) {
	return Object.entries(SlashCommands[command])
		.filter(([, _c]) => _c && !("data" in _c))
		.map(([key, value]) => ({
			name: key,
			data: value.data
		}))
}

async function logCommandToChannel ({ command, userId }) {
	const logsConfig = await LogsConfig.get()
	const { commandlog } = logsConfig
	if (!commandlog.enabled) { return }

	try {
		const channel = await getChannel(commandlog.channel)
		if (!channel) { return }

		await channel.send({
			embeds: [
				createEmbed({
					title: "Comando ejecutado",
					description: `\`${command}\`\n\n**Usuario:** <@${userId}>`,
					color: COLORS.blue,
					timestamp: new Date().toISOString()
				})
			]
		})
	} catch (error) {
		logger.error(error)
	}
}
