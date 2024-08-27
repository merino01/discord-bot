import { SlashCommandSubcommandBuilder } from "discord.js"
import { TRIGGER_ACTIONS } from "../../../../enums/triggers.js"
import { getTriggersButtons } from "../../../../utils/triggers/get-all-triggers-buttons.js"
import { BUTTON_LABELS } from "../../../../enums/interactions.js"
import { createEmbed } from "../../../../utils/discord-api/components.js"

const InfoCommand = {
	command: new SlashCommandSubcommandBuilder()
		.setName("info")
		.setDescription("Muestra los triggers"),

	execute: async (interaction) => {
		const buttonsRow = await getTriggersButtons(BUTTON_LABELS.TRIGGERS.info)
		return await interaction.reply(buttonsRow)
	}
}

export default InfoCommand

export async function getTriggerInfo (trigger) {
	const embedOptions = {
		title: trigger.name,
		description: trigger.description,
		fields: [
			{
				name: "Palabras claves",
				value: trigger.key,
				inline: true
			},
			{
				name: "Sensible",
				value: trigger.case_sensitive
					? "Sí"
					: "No",
				inline: true
			},
			{
				name: "Acción",
				value: trigger.action,
				inline: true
			},
			{
				name: "Posición del texto",
				value: trigger.text_position,
				inline: true
			}
		]
	}
	if (trigger.action === TRIGGER_ACTIONS.reply) {
		embedOptions.fields.push({
			name: "Respuesta",
			value: trigger.reply,
			inline: true
		})
	}
	return createEmbed(embedOptions)
}

