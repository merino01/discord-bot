import selectMenuHandler from "../../components/select-menus/select-menu-handler.js"
import logger from "../../logger/logger.js"

export default async function (_, interaction) {
	try {
		const { customId: selectMenuId } = interaction
		logger.info("SelectMenu interaction received")
		logger.data({
			selectMenuId,
			user: {
				tag: interaction.user.tag,
				id: interaction.user.id
			},
			channel: {
				id: interaction.channel.id,
				name: interaction.channel.name
			}
		})

		selectMenuHandler(interaction, selectMenuId)
	} catch (error) {
		logger.error("Error on button interaction")
		logger.error(error)
	}
}
