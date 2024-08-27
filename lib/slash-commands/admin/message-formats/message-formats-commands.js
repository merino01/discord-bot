import { SlashCommandSubcommandGroupBuilder } from "discord.js"
import InfoCommand from "./info.js"
import CreateCommand from "./create.js"
import DeleteCommand from "./delete.js"

const commands = {
	info: InfoCommand,
	create: CreateCommand,
	delete: DeleteCommand
}

const data = new SlashCommandSubcommandGroupBuilder()
	.setName("messageformats")
	.setDescription("Comandos para administrar los formatos de los mensajes")

for (const c in commands) {
	data.addSubcommand(commands[c].command)
}

export default {
	data,
	execute: async (interaction) => {
		const command = interaction.options.getSubcommand()

		if (command in commands) {
			return await commands[command].execute(interaction)
		}

		return await interaction.reply({
			content: "❗Comando no encontrado",
			ephemeral: true
		})
	}
}
