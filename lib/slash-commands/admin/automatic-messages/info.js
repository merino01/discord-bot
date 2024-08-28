import { SlashCommandSubcommandBuilder } from "discord.js"
import { BUTTON_LABELS } from "../../../../enums/interactions.js"
import { createEmbed } from "../../../../utils/discord-api/components.js"
import getAllAutoMessageButtons
	from "../../../../utils/channel-auto-messages/get-all-auto-message-buttons.js"
import ChannelAutoMessagesService from "../../../../services/auto-messages.service.js"
import { msToTime, ONE_SECOND } from "../../../../utils/time.js"

export default {
	defer: true,
	data: new SlashCommandSubcommandBuilder()
		.setName("info")
		.setDescription("Muestra información sobre los formatos de los mensajes"),

	execute: async () => {
		const autoMsgsButtons = await getAllAutoMessageButtons(
			BUTTON_LABELS.AUTOMATIC_MESSAGES.info
		)
		return autoMsgsButtons
	}
}

export async function getAutoMessageInfo (autoMsgId) {
	const autoMsg = await ChannelAutoMessagesService.findOneById(autoMsgId)
	if (!autoMsg) {
		return {
			content: "❌ No se ha encontrado el formato de mensaje",
			components: []
		}
	}

	const {
		title,
		message,
		categoryId,
		timeout,
		color
	} = autoMsg

	return {
		embeds: [
			createEmbed({
				title,
				description: `**Mensaje:**\n${message}`,
				fields: [
					{
						name: "Categoría",
						value: `<#${categoryId}>`
					},
					{
						name: "Tiempo de espera",
						value: timeout
							? `${msToTime(timeout * ONE_SECOND)}`
							: "Sin tiempo de espera"
					},
					{
						name: "Color",
						value: color ? color : "Por defecto",
						inline: true
					}
				]
			})
		],
		components: []
	}
}
