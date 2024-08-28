import { ChannelType, SlashCommandSubcommandBuilder } from "discord.js"
import logger from "../../logger/logger.js"

const EchoCommand = {
	ephemeral: true,
	data: new SlashCommandSubcommandBuilder()
		.setName("echo")
		.setDescription("Envía el mensaje al canal mencionado")
		.addStringOption((option) => option
			.setName("mensaje")
			.setDescription("El mensaje a enviar")
			.setRequired(true)
			.setMaxLength(2000)
		)
		.addChannelOption((option) => option
			.setName("canal")
			.setDescription("El canal donde se enviará el mensaje")
			.setRequired(true)
			.addChannelTypes(ChannelType.GuildText)
		),

	execute: async (interaction) => {
		let message = interaction.options.getString("mensaje")
		const channel = interaction.options.getChannel("canal")

		try {
			message = message.replace(/\\n/g, "\n")

			await channel.send(message)
			return {
				content: `Mensaje enviado a ${channel.name}`
			}
		} catch (error) {
			logger.error(error)
		}
	}
}

export default EchoCommand
