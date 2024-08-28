import {
	SlashCommandSubcommandBuilder
} from "discord.js"
import { BUTTON_LABELS } from "../../../../enums/interactions.js"
import getAllAutoMessageButtons
	from "../../../../utils/channel-auto-messages/get-all-auto-message-buttons.js"

export default {
	ephemeral: true,
	defer: true,
	data: new SlashCommandSubcommandBuilder()
		.setName("delete")
		.setDescription("Elimina un formato de mensaje"),

	execute: async () => {
		const autoMsgsButtons = await getAllAutoMessageButtons(
			BUTTON_LABELS.AUTOMATIC_MESSAGES.delete
		)
		return autoMsgsButtons
	}
}
