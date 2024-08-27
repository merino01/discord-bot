import {
	SlashCommandSubcommandBuilder
} from "discord.js"
import { getLogsSelect } from "../../../../utils/create-components/select-menus.js"

const LogsCommands = {
	data: new SlashCommandSubcommandBuilder()
		.setName("logs")
		.setDescription("Administrar los logs"),

	execute: async (interaction) => {
		const logsSelect = getLogsSelect()

		await interaction.reply({
			components: [logsSelect],
			ephemeral: true
		})
	}
}

export default LogsCommands
