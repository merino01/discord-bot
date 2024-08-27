import { SlashCommandBuilder } from "discord.js"
import logger from "../../../logger/logger.js"
import ClanesService from "../../../../services/clanes.service.js"
import AddLiderCommand from "./add-lider.js"
import AddUserCommand from "./add.js"
import KickUserCommand from "./kick.js"
import { COLORS } from "../../../../enums/colors.js"
import InfoCommand from "./info.js"
import RemoveLiderCommand from "./remove-lider.js"
import { createEmbed } from "../../../../utils/discord-api/components.js"
import LogsConfig from "../../../../config/logs.config.js"

const commands = {
	addlider: AddLiderCommand,
	removelider: RemoveLiderCommand,
	add: AddUserCommand,
	kick: KickUserCommand,
	info: InfoCommand
}

const data = new SlashCommandBuilder()
	.setName("clan")
	.setDescription("Comandos para administrar el clanes")

for (const command in commands) {
	data.addSubcommand(commands[command].command)
}

const ClanCommands = {
	data,
	execute: async (interaction) => {
		const subcommand = interaction.options.getSubcommand()
		if (subcommand in commands) {
			logger.info(`Command: '${subcommand}'`)
			try {
				const cmd = commands[subcommand]
				if (cmd.liderOnly) {
					const isLider = await ClanesService.isMemberLider(interaction.member)
					if (!isLider) {
						return await interaction.reply({
							content: "🚫 Solo un lider puede usar este comando",
							ephemeral: true
						})
					}
				}

				await commands[subcommand].execute(interaction)
				log(interaction)
			} catch (error) {
				logger.error(`Error executing command ${subcommand}`)
				logger.error(error)
				return await interaction.reply({
					content: "❌ Error al ejecutar el comando",
					ephemeral: true
				})
			}
		}
	}
}

export default ClanCommands

async function log (interaction) {
	const logsConfig = await LogsConfig.get()
	if (!logsConfig.claneslog.enabled) {
		return
	}
	if (!logsConfig.claneslog.enabled) {
		return
	}

	const subcommand = interaction.options.getSubcommand()
	if (!commands[subcommand].log) {
		return
	}

	const commandData = interaction.options.data[0].options
	const color = commands[subcommand].logColor || COLORS.blue

	const types = {
		3: (v) => v,
		4: (v) => v,
		5: (v) => (v ? "Sí" : "No"),
		6: (v) => `<@${v}>`,
		7: (v) => `<@&${v}>`,
		8: (v) => `<#${v}>`
	}

	const { guild, user } = interaction
	const { id, tag } = user

	const fields = commandData.map((option) => {
		const { name, value, type } = option
		const format = types[type]
		if (!format) {
			return { name, value, inline: true }
		}
		const formattedValue = types[type](value)
		return { name, value: formattedValue, inline: true }
	})

	const embed = createEmbed({
		title: `Comando ejecutado \`/clan ${subcommand}\``,
		description: `Ejecutado por <@${id}> - ${tag}`,
		color,
		fields,
		timestamp: new Date().toISOString()
	})

	const channel = guild.channels.cache.get(logsConfig.claneslog.channel)
	if (!channel) {
		return
	}
	channel.send({ embeds: [embed] })
}
