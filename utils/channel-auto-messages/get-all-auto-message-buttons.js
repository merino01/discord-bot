import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
import AutomaticMessagesService from "../../services/auto-messages.service.js"

export default async function (idPrefix) {
	const autoMsgs = await AutomaticMessagesService.findAll()
	if (!autoMsgs.length) {
		return {
			content: "❌ No hay mensajes automáticos registrados",
			ephemeral: true
		}
	}

	const buttons = []
	for (const autoMsg of autoMsgs) {
		buttons.push(new ButtonBuilder()
			.setCustomId(`${idPrefix}${autoMsg.id}`)
			.setLabel(autoMsg.title)
			.setStyle(ButtonStyle.Primary)
		)
	}

	return createRows(buttons)
}

function createRows (buttons) {
	const rows = []
	for (let i = 0; i < buttons.length; i += 5) {
		const row = new ActionRowBuilder().addComponents(buttons.slice(i, i + 5))
		rows.push(row)
	}
	return {
		components: rows
	}
}
