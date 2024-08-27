import {
	SlashCommandSubcommandBuilder
} from "discord.js"
import getAllClanesButtons, {
	getDeletedClanes
} from "../../../../utils/clanes/get-all-clanes-buttons.js"
import { BUTTON_LABELS } from "../../../../enums/interactions.js"

const InfoCommand = {
	command: new SlashCommandSubcommandBuilder()
		.setName("info")
		.setDescription("Muestra los clanes registrados")
		.addBooleanOption((option) => option
			.setName("eliminados")
			.setDescription("Mostrar los clanes eliminados")
		),

	execute: async (interaction) => {
		const showDeleted = interaction.options.getBoolean("eliminados")

		const buttonsRow = await getAllClanesButtons(BUTTON_LABELS.CLANES.info)
		if (!showDeleted) {
			return buttonsRow
		}

		let deletedClanesRow = await getDeletedClanes(BUTTON_LABELS.CLANES.info)
		if (!deletedClanesRow) {
			deletedClanesRow = { content: "❌ No hay clanes eliminados" }
		} else {
			deletedClanesRow.content = "Clanes eliminados"
		}
		deletedClanesRow.ephemeral = true
		buttonsRow.content = buttonsRow.content
			? "Clanes activos\n" + buttonsRow.content
			: "Clanes activos"
		return [
			buttonsRow,
			deletedClanesRow
		]
	}
}

export default InfoCommand

