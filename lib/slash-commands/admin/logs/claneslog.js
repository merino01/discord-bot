import { ChannelType, SlashCommandSubcommandBuilder } from "discord.js"
import logger from "../../../logger/logger.js"
import LogsConfig from "../../../../config/logs.config.js"

const EnableClaneslogCommand = {
	command: new SlashCommandSubcommandBuilder()
		.setName("clanes")
		.setDescription("Activa o desactiva los logs de clanes")
		.addBooleanOption((option) => option
			.setName("habilitar")
			.setDescription("Activar o desactivar los logs")
			.setRequired(true)
		)
		.addChannelOption((option) => option
			.setName("canal")
			.setDescription("Canal donde se enviarán los logs")
			.addChannelTypes(ChannelType.GuildText)
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
		logsConfig.claneslog.enabled = enable
		logsConfig.claneslog.channel = enable
			? channel.id
			: ""
		await LogsConfig.set(logsConfig)

		logger.info(`Claneslog ${enable ? "enabled" : "disabled"}`)
		return interaction.reply({
			content: `✅ Claneslog ${enable ? "activado" : "desactivado"} ` +
				`en el canal <#${channel.id}>`,
			ephemeral: true
		})
	}
}

export default EnableClaneslogCommand
