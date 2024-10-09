import { SlashCommandSubcommandBuilder } from "discord.js"
import getAllFormatsButtons from "../../../../utils/messages-formats/get-all-formats-buttons.js"
import { BUTTON_LABELS } from "../../../../enums/interactions.js"
import { createEmbed } from "../../../../utils/discord-api/components.js"
import { msToTime, ONE_SECOND } from "../../../../utils/time.js"
import MessagesFormatService from "../../../../services/messages-format.service.js"

export default {
	defer: true,
	data: new SlashCommandSubcommandBuilder()
		.setName("info")
		.setDescription("Muestra información sobre los formatos de los mensajes"),

	execute: async () => {
		const formatsButtons = await getAllFormatsButtons(BUTTON_LABELS.MESSAGES_FORMATS.info)
		return formatsButtons
	}
}

export async function getMessageFormatInfo (formatId) {
	const format = await MessagesFormatService.getOneById(formatId)
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
		timeout,
		channel_id
	} = format

	return {
		embeds: [
			createEmbed({
				title: name,
				description,
				fields: [
					{
						name: "Canal",
						value: `<#${channel_id}>`,
						inline: true
					},
					{
						name: "Tiempo de espera",
						value: timeout ? `${msToTime(timeout * ONE_SECOND)}` : "No tiene",
						inline: true
					},
					{
						name: "Formato",
						value: `${new RegExp(regex, regex_flags ?? "")}`
					}
				]
			})
		],
		components: []
	}
}
