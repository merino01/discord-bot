import logger from "../../logger/logger.js"
import {
	getCreatingAutoMessage,
	setCreatingAutoMessage
} from "../../../utils/channel-auto-messages/create-auto-message.js"
import { BUTTON_LABELS } from "../../../enums/interactions.js"
import { getAutomaticMessageChannelSelect } from "../../../utils/create-components/select-menus.js"

export default async function handleAutoMessagesModals (interaction, modalId) {
	const handlers = {
		[BUTTON_LABELS.AUTOMATIC_MESSAGES.showModal]: createAutoMessage
	}

	for (const [prefix, handler] of Object.entries(handlers)) {
		if (modalId.startsWith(prefix)) {
			const id = modalId.replace(prefix, "")
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

async function createAutoMessage (interaction, autoMsgId) {
	const title = interaction.fields.getTextInputValue("title")
	const msg = interaction.fields.getTextInputValue("message")
	const timeout = interaction.fields.getTextInputValue("timeout")
	const color = interaction.fields.getTextInputValue("color")

	const autoMsg = await getCreatingAutoMessage(autoMsgId)
	if (!autoMsg) {
		return await interaction.update({
			content: "❌ Ha habido un error",
			components: []
		})
	}

	autoMsg.title = title
	autoMsg.message = msg
	autoMsg.timeout = timeout
	autoMsg.color = color
	try {
		await setCreatingAutoMessage(autoMsgId, autoMsg)
		await interaction.reply({
			components: [
				getAutomaticMessageChannelSelect(autoMsgId)
			],
			ephemeral: true
		})
	} catch (error) {
		logger.error("Error creating automatic messages")
		logger.error(error)
	}
}
