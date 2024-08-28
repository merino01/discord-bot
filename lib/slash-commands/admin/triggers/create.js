import { randomUUID } from "node:crypto"
import {
	SlashCommandSubcommandBuilder
} from "discord.js"
import { getTriggersCreateFormSelects } from "../../../../utils/create-components/select-menus.js"

export default {
	data: new SlashCommandSubcommandBuilder()
		.setName("create")
		.setDescription("Crea un trigger"),

	execute: async () => {
		const newTriggerId = randomUUID()
		const selects = getTriggersCreateFormSelects(newTriggerId)
		return {
			components: selects
		}
	}
}
