import { SlashCommandSubcommandGroupBuilder } from "discord.js"
import InfoCommand from "./info.js"
import DeleteCommand from "./delete.js"
import CreateCommand from "./create.js"

const subcommands = {
	info: InfoCommand,
	create: CreateCommand,
	delete: DeleteCommand
}

const data = new SlashCommandSubcommandGroupBuilder()
	.setName("triggers")
	.setDescription("Comandos para administrar triggers")

for (const subcommand in subcommands) {
	data.addSubcommand(subcommands[subcommand].command)
}

const TriggersCommands = {
	data,
	execute: async (interaction) => {
		const subcommand = interaction.options.getSubcommand()

		if (subcommand in subcommands) {
			return await subcommands[subcommand].execute(interaction)
		}

		return await interaction.reply({
			content: "❗Comando no encontrado",
			ephemeral: true
		})
	}
}

export default TriggersCommands
