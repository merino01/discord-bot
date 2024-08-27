import logger from "../../logger/logger.js"
import { getCreatingTrigger, setCreatingTrigger } from "../../../utils/triggers/create-trigger.js"
import { BUTTON_LABELS } from "../../../enums/interactions.js"
import { getTriggerCreateForm } from "../../../utils/create-components/modals.js"

export default async function handleTriggersSelectMenus (interaction, selectMenuId) {
	const handlers = {
		[BUTTON_LABELS.TRIGGERS.createAction]: createTrigger,
		[BUTTON_LABELS.TRIGGERS.createPosition]: createTrigger,
		[BUTTON_LABELS.TRIGGERS.createSensible]: createTrigger
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

async function createTrigger (interaction, triggerId) {
	const field = interaction.customId.replace(triggerId, "")
	const firstStepFields = {
		[BUTTON_LABELS.TRIGGERS.createSensible]: "sensible",
		[BUTTON_LABELS.TRIGGERS.createAction]: "action",
		[BUTTON_LABELS.TRIGGERS.createPosition]: "position"
	}

	const trigger = getCreatingTrigger(triggerId)

	if (field in firstStepFields) {
		try {
			trigger[firstStepFields[field]] = interaction.values[0]
			await setCreatingTrigger(triggerId, trigger)

			const { sensible, action, position } = trigger
			if (sensible && action && position) {
				return interaction.showModal(getTriggerCreateForm(triggerId))
			}
		} catch (error) {
			logger.error(error)
			return interaction.update({
				content: "❌ Ha ocurrido un error al procesar la acción",
				components: []
			})
		}
	}

	return interaction.deferUpdate()
}

