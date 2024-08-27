import { BUTTON_LABELS } from "../../../enums/interactions.js"
import {
	getCreatingMessageFormat,
	setCreatingMessageFormat
} from "../../../utils/messages-formats/create-message-format.js"
import logger from "../../logger/logger.js"

export default async function handleMessagesFormatsModals (interaction, modalId) {
	const handlers = {
		[BUTTON_LABELS.MESSAGES_FORMATS.createShowModal]: createMessageFormat
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

async function createMessageFormat (interaction, formatId) {
	const name = interaction.fields.getTextInputValue("name")
	const description = interaction.fields.getTextInputValue("description")
	const regex = interaction.fields.getTextInputValue("regex")
	const regexFlags = interaction.fields.getTextInputValue("regexFlags")
	const timeout = interaction.fields.getTextInputValue("timeout")

	const format = await getCreatingMessageFormat(formatId)
	if (!format) {
		return await interaction.update({
			content: "❌ No se ha encontrado el formato de mensaje",
			components: []
		})
	}

	format.name = name
	format.description = description
	format.regex = regex
	format.regex_flags = regexFlags
	format.timeout = timeout
	try {
		await setCreatingMessageFormat(formatId, format)
		await interaction.update({
			content: "✅ Formato de mensaje creado",
			components: []
		})
		logger.info("Message format created")
		logger.data(format)
	} catch (error) {
		logger.error("Error creating message format")
		logger.error(error)
	}
}
