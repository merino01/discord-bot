import { BUTTON_LABELS } from "../../../enums/interactions.js"
import ChannelAutoMessagesService from "../../../services/auto-messages.service.js"
import logger from "../../logger/logger.js"
import { getAutoMessageInfo } from "../../slash-commands/admin/channel-automatic-messages/info.js"

export async function handleChannelAutoMsgButtons (interaction, buttonId) {
	const handlers = {
		[BUTTON_LABELS.AUTOMATIC_MESSAGES.info]: getInfo,
		[BUTTON_LABELS.AUTOMATIC_MESSAGES.delete]: deleteAutoMessage
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

async function deleteAutoMessage (interaction, autoMsgId) {
	try {
		await ChannelAutoMessagesService.deleteOneById(autoMsgId)
		return await interaction.update({
			content: "✅ Mensaje automático eliminado",
			components: []
		})
	} catch (error) {
		logger.error(error)
		return await interaction.update({
			content: "❌ Ha ocurrido un error",
			components: []
		})
	}
}

async function getInfo (interaction, autoMsgId) {
	const autoMsgInfo = await getAutoMessageInfo(autoMsgId)
	return await interaction.update(autoMsgInfo)
}
