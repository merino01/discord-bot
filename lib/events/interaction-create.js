const InteractionCreate = async (client, interaction) => {
	if (interaction.isCommand()) {
		client.emit("slashCommandInteraction", interaction)
	} else if (interaction.isButton()) {
		client.emit("buttonInteraction", interaction)
	} else if (interaction.isStringSelectMenu()) {
		client.emit("selectMenuInteraction", interaction)
	} else if (interaction.isChannelSelectMenu()) {
		client.emit("selectMenuInteraction", interaction)
	} else if (interaction.isModalSubmit()) {
		client.emit("modalInteraction", interaction)
	}
}

export default InteractionCreate
