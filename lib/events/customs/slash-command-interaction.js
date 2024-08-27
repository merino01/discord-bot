import SlashCommandsMap from "../../dictionaries/slash-commands.js"
import logger from "../../logger/logger.js"

const SlashCommandInteraction = async (_, interaction) => {
	try {
		logger.info(
			`Slash command: '${interaction.commandName}' executed by` +
			` '${interaction.user.tag}' (${interaction.user.id})`
		)
		if (!SlashCommandsMap[interaction.commandName]) {
			return
		}

		SlashCommandsMap[interaction.commandName].execute(interaction)
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
