import { randomUUID } from "node:crypto"
import {
	SlashCommandSubcommandBuilder
} from "discord.js"
import { getMessageFormatChannelSelect } from "../../../../utils/create-components/select-menus.js"

export default {
	command: new SlashCommandSubcommandBuilder()
		.setName("create")
		.setDescription("Crea un nuevo formato de mensaje"),

	execute: async (interaction) => {
		const id = randomUUID()

		return await interaction.reply({
			components: [getMessageFormatChannelSelect(id)],
			ephemeral: true
		})
	}
}
