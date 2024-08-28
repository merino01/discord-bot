import { ChannelType, SlashCommandSubcommandBuilder } from "discord.js"
import logger from "../../../logger/logger.js"
import ClanesConfig from "../../../../config/clanes.config.js"
import logClanCommandToChannel from "../../../../utils/clanes/log-to-channel.js"
import { COLORS } from "../../../../enums/colors.js"

const UpdateTextCategoryCommand = {
	data: new SlashCommandSubcommandBuilder()
		.setName("updatetextcategory")
		.setDescription("Actualiza la categoría de los canales de texto")
		.addChannelOption((option) => option
			.setName("categoria")
			.setDescription("Categoría de texto")
			.setRequired(true)
			.addChannelTypes(ChannelType.GuildCategory)
		),

	execute: async (interaction) => {
		const category = interaction.options.getChannel("categoria")

		try {
			const clanesConfig = await ClanesConfig.get()
			clanesConfig.text_parent_id = category.id
			await ClanesConfig.set(clanesConfig)

			logger.info(`Text category updated to '${category.name}' (${category.id})`)

			logClanCommandToChannel({
				userId: interaction.member.id,
				command: "/admin clanes updatetextcategory",
				fields: [
					{ name: "Categoría", value: `<#${category.id}>` }
				],
				color: COLORS.blue
			})
			return {
				content: `✅ Categoría de texto actualizada a <#${category.id}>`
			}
		} catch (error) {
			logger.error("Error updating text category")
			logger.error(error)
			return {
				content: "❌ Error al actualizar la categoría de texto"
			}
		}
	}
}

export default UpdateTextCategoryCommand
