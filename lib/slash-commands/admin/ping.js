import { SlashCommandSubcommandBuilder } from "discord.js"

const PingCommand = {
	ephemeral: true,
	data: new SlashCommandSubcommandBuilder()
		.setName("ping")
		.setDescription("Devuelve el ping del bot"),

	execute: async (interaction) => {
		const ping = Date.now() - interaction.createdTimestamp + " ms"
		return {
			content: `Ping: ${ping}`
		}
	}
}

export default PingCommand
