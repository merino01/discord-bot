import { BUTTON_LABELS } from "../../../enums/interactions.js"
import { getLogsEnableSelectMenu } from "../../../utils/create-components/select-menus.js"
import logger from "../../logger/logger.js"

export async function handleLogsButtons (interaction, buttonId) {
	const handlers = {
		[BUTTON_LABELS.LOGS.edit]: edit
	}

	for (const [prefix, handler] of Object.entries(handlers)) {
		if (buttonId.startsWith(prefix)) {
			const id = buttonId.replace(prefix, "")
			try {
				return await handler(interaction, id)
			} catch (error) {
				logger.error(error)
				return interaction.update({
					content: "❌ Ha ocurrido un error al procesar la acción",
					components: []
				})
			}
		}
	}
}

async function edit (interaction, logName) {
	const rows = [
		getLogsEnableSelectMenu(logName)
	]

	await interaction.update({
		embeds: [],
		components: rows
	})
}
