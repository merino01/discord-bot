import { SlashCommandSubcommandBuilder } from "discord.js"
import logger from "../../../logger/logger.js"
import { COLORS } from "../../../../enums/colors.js"
import ClanesConfig from "../../../../config/clanes.config.js"

const AddLiderRoleCommand = {
	log: true,
	logColor: COLORS.blue,
	command: new SlashCommandSubcommandBuilder()
		.setName("addliderrole")
		.setDescription("Añade un rol de lider")
		.addRoleOption((option) => option
			.setName("rol")
			.setDescription("Rol lider")
			.setRequired(true)
		),

	execute: async (interaction) => {
		const role = interaction.options.getRole("rol")

		try {
			const clanesConfig = await ClanesConfig.get()

			let { lider_roles } = clanesConfig
			if (!Array.isArray(lider_roles)) {
				lider_roles = []
			}
			if (lider_roles.includes(role.id)) {
				return {
					content: "❌ El rol ya está añadido"
				}
			}

			lider_roles.push(role.id)
			await ClanesConfig.set(clanesConfig)

			logger.info(`Clan lider role added: '${role.name}' (${role.id})`)
			return {
				content: `Rol <#${role.id}> añadido a los roles de los lideres`
			}
		} catch (error) {
			logger.error("Error adding lider role")
			logger.error(error)
			return {
				content: "❌ Error al añadir el rol de lider"
			}
		}
	}
}

export default AddLiderRoleCommand