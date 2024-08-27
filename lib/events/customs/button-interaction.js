import logger from "../../logger/logger.js"
import buttonHandler from "../../components/buttons/button-handler.js"

export default async function (_, interaction) {
	try {
		const { customId: buttonId } = interaction
		logger.info("Button interaction received")
		logger.data({
			buttonId,
			user: {
				tag: interaction.user.tag,
				id: interaction.user.id
			},
			channel: {
				id: interaction.channel.id,
				name: interaction.channel.name
			}
		})

		buttonHandler(interaction, buttonId)
	} catch (error) {
		logger.error("Error on button interaction")
		logger.error(error)
	}
}
