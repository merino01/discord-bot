import modalHandler from "../../components/modals/modal-handler.js"
import logger from "../../logger/logger.js"

export default async function (_, interaction) {
	try {
		const { customId: modalId } = interaction
		logger.info("Modal interaction received")
		logger.data({
			modalId,
			user: {
				tag: interaction.user.tag,
				id: interaction.user.id
			},
			channel: {
				id: interaction.channel.id,
				name: interaction.channel.name
			}
		})

		modalHandler(interaction, modalId)
	} catch (error) {
		logger.error("Error on modal interaction")
		logger.error(error)
	}
}
