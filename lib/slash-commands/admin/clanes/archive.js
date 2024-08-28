import { ChannelType, SlashCommandSubcommandBuilder } from "discord.js"
import logger from "../../../logger/logger.js"
import ClanesConfig from "../../../../config/clanes.config.js"

const ArchiveCommand = {
	data: new SlashCommandSubcommandBuilder()
		.setName("archive")
		.setDescription("Habilita la opción de archivar clanes")
		.addBooleanOption((option) => option
			.setName("habilitar")
			.setDescription("Habilita o deshabilita la opción de archivar clanes")
			.setRequired(true)
		)
		.addChannelOption((option) => option
			.setName("categoria")
			.setDescription("Categoría donde se archivarán los canales de texto")
			.setRequired(false)
			.addChannelTypes(ChannelType.GuildCategory)
		),

	execute: async (interaction) => {
		const enable = interaction.options.getBoolean("habilitar")
		const category = interaction.options.getChannel("categoria")
		let msgContent = ""

		try {
			const clanesConfig = await ClanesConfig.get()

			if (enable && !category) {
				return {
					content: "❗Debes especificar una categoría"
				}
			}

			clanesConfig.archive = enable
			clanesConfig.archived_parent_id = enable
				? category.id
				: ""

			await ClanesConfig.set(clanesConfig)

			if (enable) {
				msgContent = "✅ Opción de archivar clanes habilitada" +
					`, se archivarán en <#${category.id}>`
			} else {
				msgContent = "✅ Opción de archivar clanes deshabilitada"
			}

			logger.info(`Archive option set to ${enable}`)
			return {
				content: msgContent
			}
		} catch (error) {
			logger.error("Error on setting archive option")
			logger.error(error)
			return {
				content: "❌ Error al establecer la opción de archivar clanes"
			}
		}
	}
}

export default ArchiveCommand
