import { PermissionFlagsBits, SlashCommandSubcommandGroupBuilder } from "discord.js"
import InfoCommand from "./info.js"
import CreateCommand from "./create.js"
import DeleteCommand from "./delete.js"
import UpdateTextCategoryCommand from "./update-text-category.js"
import UpdateVoiceCategoryCommand from "./update-voice-category.js"
import AddAdditionalRoleCommand from "./add-additional-role.js"
import RemoveAdditionalRoleCommand from "./remove-additional-role.js"
import AddLiderRoleCommand from "./add-lider-role.js"
import ArchiveCommand from "./archive.js"
import { COLORS } from "../../../../enums/colors.js"
import AddVoiceChannelCommand from "./add-voice-channel.js"
import { createEmbed } from "../../../../utils/discord-api/components.js"
import LogsConfig from "../../../../config/logs.config.js"

const subcommands = {
	info: InfoCommand,
	create: CreateCommand,
	delete: DeleteCommand,
	updatetextcategory: UpdateTextCategoryCommand,
	updatevoicecategory: UpdateVoiceCategoryCommand,
	addadditionalrole: AddAdditionalRoleCommand,
	removeadditionalrole: RemoveAdditionalRoleCommand,
	addliderrole: AddLiderRoleCommand,
	archive: ArchiveCommand,
	addvoicechannel: AddVoiceChannelCommand
}

const data = new SlashCommandSubcommandGroupBuilder()
	.setName("clanes")
	.setDescription("Comandos para administrar clanes")

for (const subcommand in subcommands) {
	data.addSubcommand(subcommands[subcommand].command)
}

const ClanesCommands = {
	data,
	execute: async (interaction) => {
		await interaction.deferReply({ ephemeral: true })
		await checkBotPermissions(interaction)

		const subcommand = interaction.options.getSubcommand()

		if (subcommand in subcommands) {
			const response = await subcommands[subcommand].execute(interaction)
			await log(interaction)
			if (Array.isArray(response)) {
				await interaction.editReply(response[0])
				for (let i = 1; i < response.length; i++) {
					await interaction.followUp(response[i])
				}
			} else {
				await interaction.editReply(response)
			}
			return
		}

		return await interaction.editReply({
			content: "❗Comando no encontrado"
		})
	}
}

export default ClanesCommands

async function checkBotPermissions (interaction) {
	const { guild } = interaction
	const botMember = await guild.members.fetch(interaction.client.user.id)
	const requiredPermissions = [
		PermissionFlagsBits.ManageRoles,
		PermissionFlagsBits.ManageChannels
	]

	for (const permission of requiredPermissions) {
		if (!botMember.permissions.has(permission)) {
			return await interaction.editReply({
				content: `❌ Necesito el permiso \`${permission}\` ` +
					"para poder ejecutar comandos de clanes"
			})
		}
	}
}

async function log (interaction) {
	const logsConfig = await LogsConfig.get()
	if (!logsConfig.claneslog.enabled) {
		return
	}

	const subcommand = interaction.options.getSubcommand()
	if (!subcommands[subcommand].log) {
		return
	}

	const commandData = interaction.options.data[0].options[0].options
	const color = subcommands[subcommand].logColor || COLORS.blue

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
		title: `Comando ejecutado \`/admin clanes ${subcommand}\``,
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
