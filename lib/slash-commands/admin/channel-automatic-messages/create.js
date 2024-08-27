import { randomUUID } from "node:crypto"
import {
	SlashCommandSubcommandBuilder
} from "discord.js"
import { getAutoMessagesCreateForm } from "../../../../utils/create-components/modals.js"

export default {
	command: new SlashCommandSubcommandBuilder()
		.setName("create")
		.setDescription("Crear un mensajes automático en una categoría"),
	execute: async (interaction) => {
		const id = randomUUID()
		const modal = getAutoMessagesCreateForm(id)
		await interaction.showModal(modal)
	}
}

