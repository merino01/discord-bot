import {
	SlashCommandSubcommandBuilder
} from "discord.js"
import { getLogsSelect } from "../../../utils/create-components/select-menus.js"

export default {
	data: new SlashCommandSubcommandBuilder()
		.setName("logs")
		.setDescription("Administrar los logs"),

	execute: async () => {
		const logsSelect = getLogsSelect()

		return {
			components: [logsSelect]
		}
	}
}
