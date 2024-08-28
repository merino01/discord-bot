import { SlashCommandSubcommandBuilder } from "discord.js"
import { getTriggersButtons } from "../../../../utils/triggers/get-all-triggers-buttons.js"
import { BUTTON_LABELS } from "../../../../enums/interactions.js"

export default {
	defer: true,
	data: new SlashCommandSubcommandBuilder()
		.setName("delete")
		.setDescription("Elimina un trigger"),

	execute: async () => {
		const buttonsRow = await getTriggersButtons(BUTTON_LABELS.TRIGGERS.delete)
		return buttonsRow
	}
}
