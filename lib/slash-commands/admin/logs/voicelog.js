import { SlashCommandSubcommandBuilder } from "discord.js"
import logger from "../../../logger/logger.js"
import LogsConfig from "../../../../config/logs.config.js"

const EnableVoicelogCommand = {
	command: new SlashCommandSubcommandBuilder()
		.setName("voice")
		.setDescription("Activa o desactiva el voicelog")
		.addBooleanOption((option) => option
			.setName("habilitar")
			.setDescription("Activa o desactiva el chatlog")
			.setRequired(true)
		)
		.addChannelOption((option) => option
			.setName("canal")
			.setDescription("Canal donde se enviarán los logs")
		),
	execute: async (interaction) => {
		const enable = interaction.options.getBoolean("habilitar")
		const channel = interaction.options.getChannel("canal")

		if (enable && !channel) {
			return interaction.reply({
				content: "❗Debes especificar un canal",
				ephemeral: true
			})
		}

		const logsConfig = await LogsConfig.get()
		logsConfig.voicelog.enabled = enable
		logsConfig.voicelog.channel = enable
			? channel.id
			: ""
		await LogsConfig.set(logsConfig)

		logger.info(`Voicelog ${enable ? "enabled" : "disabled"}`)
		return interaction.reply({
			content: `✅ Voicelog ${enable ? "activado" : "desactivado"}`,
			ephemeral: true
		})
	}
}

export default EnableVoicelogCommand
