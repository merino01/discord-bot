import { randomUUID } from "node:crypto"
import {
	SlashCommandSubcommandBuilder
} from "discord.js"
import { getMessageFormatChannelSelect } from "../../../../utils/create-components/select-menus.js"

export default {
	data: new SlashCommandSubcommandBuilder()
		.setName("create")
		.setDescription("Crea un nuevo formato de mensaje"),

	execute: async () => {
		const id = randomUUID()

		return {
			components: [getMessageFormatChannelSelect(id)]
		}
	}
}
