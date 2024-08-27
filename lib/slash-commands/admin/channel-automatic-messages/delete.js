import {
	SlashCommandSubcommandBuilder
} from "discord.js"
import { BUTTON_LABELS } from "../../../../enums/interactions.js"
import getAllAutoMessageButtons
	from "../../../../utils/channel-auto-messages/get-all-auto-message-buttons.js"

export default {
	command: new SlashCommandSubcommandBuilder()
		.setName("delete")
		.setDescription("Elimina un formato de mensaje"),

	execute: async (interaction) => {
		const autoMsgsButtons = await getAllAutoMessageButtons(
			BUTTON_LABELS.AUTOMATIC_MESSAGES.delete
		)
		return await interaction.reply({
			...autoMsgsButtons,
			ephemeral: true
		})
	}
}
