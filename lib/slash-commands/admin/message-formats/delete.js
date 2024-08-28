import {
	SlashCommandSubcommandBuilder
} from "discord.js"
import getAllFormatsButtons from "../../../../utils/messages-formats/get-all-formats-buttons.js"
import { BUTTON_LABELS } from "../../../../enums/interactions.js"

export default {
	defer: true,
	data: new SlashCommandSubcommandBuilder()
		.setName("delete")
		.setDescription("Elimina un formato de mensaje"),

	execute: async () => {
		const formatsButtons = await getAllFormatsButtons(BUTTON_LABELS.MESSAGES_FORMATS.delete)
		return formatsButtons
	}
}
