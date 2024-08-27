import { SlashCommandSubcommandBuilder } from "discord.js"
import getAllFormatsButtons from "../../../../utils/messages-formats/get-all-formats-buttons.js"
import { BUTTON_LABELS } from "../../../../enums/interactions.js"
import MessageFormatsService from "../../../../services/message-formats.service.js"
import { createEmbed } from "../../../../utils/discord-api/components.js"
import { msToTime, ONE_SECOND } from "../../../../utils/time.js"

export default {
	command: new SlashCommandSubcommandBuilder()
		.setName("info")
		.setDescription("Muestra información sobre los formatos de los mensajes"),

	execute: async (interaction) => {
		const formatsButtons = await getAllFormatsButtons(BUTTON_LABELS.MESSAGES_FORMATS.info)
		return await interaction.reply({ ...formatsButtons, ephemeral: true })
	}
}

export async function getMessageFormatInfo (formatId) {
	const format = await MessageFormatsService.findOneById(formatId)
	if (!format) {
		return {
			content: "❌ No se ha encontrado el formato de mensaje",
			components: []
		}
	}

	const {
		name,
		description,
		regex,
		regex_flags,
		timeout
	} = format

	return {
		embeds: [
			createEmbed({
				title: name,
				description,
				fields: [
					{
						name: "Canal",
						value: `<#${format.channelId}>`,
						inline: true
					},
					{
						name: "Tiempo de espera",
						value: timeout ? `${msToTime(timeout * ONE_SECOND)}` : "No tiene",
						inline: true
					},
					{
						name: "Formato",
						value: `${new RegExp(regex, regex_flags)}`
					}
				]
			})
		],
		components: []
	}
}
