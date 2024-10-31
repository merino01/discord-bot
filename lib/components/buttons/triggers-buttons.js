import { BUTTON_LABELS } from "../../../enums/interactions.js"
import TriggersService from "../../../services/triggers.service.js"
import logger from "../../logger/logger.js"
import { getTriggerInfo } from "../../slash-commands/admin/triggers/info.js"

export async function handleTriggerButtons (interaction, buttonId) {
	const handlers = {
		[BUTTON_LABELS.TRIGGERS.info]: getInfo,
		[BUTTON_LABELS.TRIGGERS.delete]: delTrigger
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

async function getInfo (interaction, triggerId) {
	const trigger = await TriggersService.deleteOneById(triggerId)
	if (!trigger) {
		return await interaction.update({
			content: "❌ No se ha encontrado información para este trigger.",
			components: []
		})
	}

	const info = await getTriggerInfo(trigger)
	await interaction.update({
		embeds: [info],
		components: []
	})
}

async function delTrigger (interaction, triggerId) {
	const trigger = await TriggersService.getOneById(triggerId)
	if (!trigger) {
		return await interaction.update({
			content: "❌ No se ha encontrado el trigger.",
			components: []
		})
	}

	try {
		await TriggersService.deleteOneById(triggerId)
		logger.info(
			`Trigger '${trigger.name}' deleted by ` +
			`'${interaction.user.tag}' (${interaction.user.id})`
		)
		await interaction.update({
			content: `✅ Trigger \`${trigger.name}\` eliminado correctamente`,
			components: []
		})
	} catch (error) {
		logger.error("Error on delete trigger " + triggerId)
		logger.error(error)
	}
}
