import { BUTTON_LABELS } from "../../../enums/interactions.js"
import {
	getCreatingAutoMessage,
	setCreatingAutoMessage
} from "../../../utils/channel-auto-messages/create-auto-message.js"
import logger from "../../logger/logger.js"

export async function handleChannelAutoMsgSelectMenus (interaction, selectMenuId) {
	const handlers = {
		[BUTTON_LABELS.AUTOMATIC_MESSAGES.categorySelect]: createAutoMsg
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

async function createAutoMsg (interaction, autoMsgId) {
	const categoryId = interaction.values[0]
	const autoMsg = await getCreatingAutoMessage(autoMsgId)
	autoMsg.categoryId = categoryId
	try {
		await setCreatingAutoMessage(autoMsgId, autoMsg)
		return await interaction.update({
			content: "✅ Mensaje automático creado para todos los " +
				`canales dentro de la categoría <#${categoryId}>`,
			components: []
		})
	} catch (error) {
		logger.error(error)
		return await interaction.update({
			content: "❌ Ha habido un error",
			components: []
		})
	}
}
