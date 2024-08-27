import logger from "../../logger/logger.js"
import { setCreatingMessageFormat } from "../../../utils/messages-formats/create-message-format.js"
import { BUTTON_LABELS } from "../../../enums/interactions.js"
import { getMessageFormatCreateForm } from "../../../utils/create-components/modals.js"

export default async function handleTriggersSelectMenus (interaction, selectMenuId) {
	const handlers = {
		[BUTTON_LABELS.MESSAGES_FORMATS.createChannel]: createMessageFormat
	}

	for (const [prefix, handler] of Object.entries(handlers)) {
		if (selectMenuId.startsWith(prefix)) {
			const id = selectMenuId.replace(prefix, "")
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

async function createMessageFormat (interaction, formatId) {
	const channelId = interaction.values[0]

	const format = {
		channelId
	}
	setCreatingMessageFormat(formatId, format)
	return await interaction.showModal(getMessageFormatCreateForm(formatId))
}
