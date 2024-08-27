import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
import TriggersService from "../../services/triggers.service.js"

export const getTriggersButtons = async (prefix) => {
	const triggers = await TriggersService.findAll()
	if (!triggers) {
		return {
			content: "❌ No hay triggers registrados",
			ephemeral: true
		}
	}

	const buttons = []
	for (const trigger of triggers) {
		const button = new ButtonBuilder()
			.setCustomId(`${prefix}${trigger.id}`)
			.setLabel(`${trigger.name}`)
			.setStyle(ButtonStyle.Secondary)
		buttons.push(button)
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
		components: rows,
		ephemeral: true
	}
}
