import { SlashCommandSubcommandBuilder } from "discord.js"

const PingCommand = {
	data: new SlashCommandSubcommandBuilder()
		.setName("ping")
		.setDescription("Devuelve el ping del bot"),

	execute: async (interaction) => {
		const ping = Date.now() - interaction.createdTimestamp + " ms"
		await interaction.reply({
			content: `Ping: ${ping}`,
			ephemeral: true
		})
	}
}

export default PingCommand
