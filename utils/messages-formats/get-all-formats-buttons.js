import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
import MessageFormatsService from "../../services/message-formats.service.js"

export default async function (idPrefix) {
	const formats = await MessageFormatsService.findAll()
	if (!formats.length) {
		return {
			content: "❌ No hay formatos registrados",
			ephemeral: true
		}
	}

	const buttons = []
	for (const format of formats) {
		buttons.push(new ButtonBuilder()
			.setCustomId(`${idPrefix}${format.id}`)
			.setLabel(format.name)
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
