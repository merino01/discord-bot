import { BUTTON_LABELS } from "../../../enums/interactions.js"
import MessagesFormatService from "../../../services/messages-format.service.js"
import logger from "../../logger/logger.js"
import { getMessageFormatInfo } from "../../slash-commands/admin/message-formats/info.js"

export async function handleMessageFormatsButtons (interaction, buttonId) {
	const handlers = {
		[BUTTON_LABELS.MESSAGES_FORMATS.info]: getInfo,
		[BUTTON_LABELS.MESSAGES_FORMATS.delete]: deleteMessageFormat
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

async function getInfo (interaction, formatId) {
	const formatInfo = await getMessageFormatInfo(formatId)
	return await interaction.update(formatInfo)
}

async function deleteMessageFormat (interaction, formatId) {
	try {
		await MessagesFormatService.deleteOneById(formatId)
		return await interaction.update({
			content: "✅ Formato de mensaje eliminado",
			components: []
		})
	} catch (error) {
		logger.error(error)
		return await interaction.update({
			content: "❌ Ha ocurrido un error al eliminar el formato de mensaje",
			components: []
		})
	}
}
