import { SlashCommandSubcommandBuilder } from "discord.js"
import { getTriggersButtons } from "../../../../utils/triggers/get-all-triggers-buttons.js"
import { BUTTON_LABELS } from "../../../../enums/interactions.js"

const DeleteCommand = {
	command: new SlashCommandSubcommandBuilder()
		.setName("delete")
		.setDescription("Elimina un trigger"),

	execute: async (interaction) => {
		const buttonsRow = await getTriggersButtons(BUTTON_LABELS.TRIGGERS.delete)
		await interaction.reply(buttonsRow)
	}
}

export default DeleteCommand

