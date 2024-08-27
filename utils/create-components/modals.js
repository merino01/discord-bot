import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js"
import { BUTTON_LABELS } from "../../enums/interactions.js"

/** LOGS */

/** CLANES */

/** TRIGGERS */
export const getTriggerCreateForm = (triggerId) => {
	const modal = new ModalBuilder()
		.setCustomId(`${BUTTON_LABELS.TRIGGERS.showModal}${triggerId}`)
		.setTitle("Crear trigger")

	const nameTextInput = new TextInputBuilder()
		.setCustomId("name")
		.setLabel("Nombre")
		.setStyle(TextInputStyle.Short)
	const descriptionTextInput = new TextInputBuilder()
		.setCustomId("description")
		.setLabel("Descripción")
		.setStyle(TextInputStyle.Paragraph)
	const keywordsTextInput = new TextInputBuilder()
		.setCustomId("key")
		.setLabel("Palabras clave")
		.setStyle(TextInputStyle.Short)
	const replyTextInput = new TextInputBuilder()
		.setCustomId("reply")
		.setLabel("Respuesta")
		.setStyle(TextInputStyle.Paragraph)
		.setRequired(false)

	const nameInputRow = new ActionRowBuilder().addComponents(nameTextInput)
	const descriptionInputRow = new ActionRowBuilder().addComponents(descriptionTextInput)
	const keywordsInputRow = new ActionRowBuilder().addComponents(keywordsTextInput)
	const replyInputRow = new ActionRowBuilder().addComponents(replyTextInput)

	modal.addComponents(
		nameInputRow,
		descriptionInputRow,
		keywordsInputRow,
		replyInputRow
	)

	return modal
}

/** AUTOMATIC MESSAGES */
export const getAutoMessagesCreateForm = (autoMsgId) => {
	const modal = new ModalBuilder()
		.setCustomId(`${BUTTON_LABELS.AUTOMATIC_MESSAGES.showModal}${autoMsgId}`)
		.setTitle("Crear un mensaje automático")

	const titleTextInput = new TextInputBuilder()
		.setCustomId("title")
		.setLabel("Nombre")
		.setStyle(TextInputStyle.Short)
	const messageTexInput = new TextInputBuilder()
		.setCustomId("message")
		.setLabel("Mensaje")
		.setStyle(TextInputStyle.Paragraph)
	const timeoutTextInput = new TextInputBuilder()
		.setCustomId("timeout")
		.setLabel("Tiempo de espera")
		.setStyle(TextInputStyle.Short)
		.setRequired(false)
	const colorTextInput = new TextInputBuilder()
		.setCustomId("color")
		.setLabel("Color")
		.setStyle(TextInputStyle.Short)
		.setRequired(false)

	const titleInputRow = new ActionRowBuilder().addComponents(titleTextInput)
	const messageInputRow = new ActionRowBuilder().addComponents(messageTexInput)
	const timeoutInputRow = new ActionRowBuilder().addComponents(timeoutTextInput)
	const colorInputRow = new ActionRowBuilder().addComponents(colorTextInput)

	modal.addComponents(
		titleInputRow,
		messageInputRow,
		timeoutInputRow,
		colorInputRow
	)

	return modal
}

/** MESSAGE FORMATS */
export const getMessageFormatCreateForm = (triggerId) => {
	const modal = new ModalBuilder()
		.setCustomId(`${BUTTON_LABELS.MESSAGES_FORMATS.createShowModal}${triggerId}`)
		.setTitle("Crear formato de mensaje")

	const nameTextInput = new TextInputBuilder()
		.setCustomId("name")
		.setLabel("Nombre")
		.setStyle(TextInputStyle.Short)
	const descriptionTextInput = new TextInputBuilder()
		.setCustomId("description")
		.setLabel("Descripción")
		.setStyle(TextInputStyle.Paragraph)
	const regexTextInput = new TextInputBuilder()
		.setCustomId("regex")
		.setLabel("Expresión regular")
		.setStyle(TextInputStyle.Short)
	const regexFlagsTextInput = new TextInputBuilder()
		.setCustomId("regexFlags")
		.setLabel("Flags de la expresión regular")
		.setStyle(TextInputStyle.Short)
		.setRequired(false)
	const timeoutTextInput = new TextInputBuilder()
		.setCustomId("timeout")
		.setLabel("Tiempo de espera")
		.setStyle(TextInputStyle.Short)
		.setRequired(false)

	const nameInputRow = new ActionRowBuilder().addComponents(nameTextInput)
	const descriptionInputRow = new ActionRowBuilder().addComponents(descriptionTextInput)
	const regexInputRow = new ActionRowBuilder().addComponents(regexTextInput)
	const regexFlagsInputRow = new ActionRowBuilder().addComponents(regexFlagsTextInput)
	const timeoutInputRow = new ActionRowBuilder().addComponents(timeoutTextInput)

	modal.addComponents(
		nameInputRow,
		descriptionInputRow,
		regexInputRow,
		regexFlagsInputRow,
		timeoutInputRow
	)

	return modal
}
