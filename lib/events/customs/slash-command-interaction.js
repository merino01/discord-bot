import logger from "../../logger/logger.js"
import { executeSlashCommands } from "../../slash-commands/slash-commands.js"

const SlashCommandInteraction = async (_, interaction) => {
	try {
		await executeSlashCommands(interaction)
	} catch (error) {
		logger.error(`Command: '${interaction.commandName}' failed to execute`)
		logger.error(error)
		await interaction.reply({
			content: "❌ Ha habido un error al ejecutar este comando.",
			ephemeral: true
		})
	}
}

export default SlashCommandInteraction
