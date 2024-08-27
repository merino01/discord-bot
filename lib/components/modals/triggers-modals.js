import logger from "../../logger/logger.js"
import { getCreatingTrigger, setCreatingTrigger } from "../../../utils/triggers/create-trigger.js"
import { BUTTON_LABELS } from "../../../enums/interactions.js"
import { getTriggersCreateFormSelects } from "../../../utils/create-components/select-menus.js"

export default async function handleTriggersModals (interaction, modalId) {
	const handlers = {
		[BUTTON_LABELS.TRIGGERS.showModal]: createTrigger
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

async function createTrigger (interaction, triggerId) {
	const name = interaction.fields.getTextInputValue("name")
	const description = interaction.fields.getTextInputValue("description")
	const key = interaction.fields.getTextInputValue("key")
	const reply = interaction.fields.getTextInputValue("reply")

	try {
		const trigger = await getCreatingTrigger(triggerId)
		trigger.name = name
		trigger.description = description
		trigger.key = key
		trigger.reply = reply
		await setCreatingTrigger(triggerId, trigger)
		return await interaction.update({
			components: [],
			content: "✅ Trigger creado correctamente"
		})
	} catch (error) {
		logger.error(error)
		return interaction.update({
			content: "❌ Ha ocurrido un error al procesar la acción",
			components: []
		})
	}
}

