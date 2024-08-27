import { randomUUID } from "node:crypto"
import {
	SlashCommandSubcommandBuilder
} from "discord.js"
import { getTriggersCreateFormSelects } from "../../../../utils/create-components/select-menus.js"

const CreateCommand = {
	command: new SlashCommandSubcommandBuilder()
		.setName("create")
		.setDescription("Crea un trigger"),

	execute: async (interaction) => {
		const newTriggerId = randomUUID()
		const selects = getTriggersCreateFormSelects(newTriggerId)
		return await interaction.reply({
			components: selects,
			ephemeral: true
		})
	}
}

export default CreateCommand
