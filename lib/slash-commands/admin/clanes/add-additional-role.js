import { SlashCommandSubcommandBuilder } from "discord.js"
import logger from "../../../logger/logger.js"
import ClanesConfig from "../../../../config/clanes.config.js"
import logClanCommandToChannel from "../../../../utils/clanes/log-to-channel.js"
import { COLORS } from "../../../../enums/colors.js"

const AddAdditionalRoleCommand = {
	data: new SlashCommandSubcommandBuilder()
		.setName("addadditionalrole")
		.setDescription("Añade un rol adicional a los clanes")
		.addRoleOption((option) => option
			.setName("rol")
			.setDescription("Rol adicional")
			.setRequired(true)
		),

	execute: async (interaction) => {
		const role = interaction.options.getRole("rol")

		try {
			const clanesConfig = await ClanesConfig.get()

			const additional_roles = clanesConfig.additional_roles
			if (additional_roles.includes(role.id)) {
				return {
					content: "❌ El rol ya está añadido"
				}
			}

			additional_roles.push(role.id)
			await ClanesConfig.set(clanesConfig)

			logger.info(`Clan additional role added: '${role.name}' (${role.id})`)

			logClanCommandToChannel({
				userId: interaction.member.id,
				command: "/admin clanes addadditionalrole",
				fields: [
					{ name: "Rol", value: `<@&${role.id}>` }
				],
				color: COLORS.green
			})
			return {
				content: `✅ Rol <@&${role.id}> añadido a los roles adicionales`
			}
		} catch (error) {
			logger.error("Error adding additional role")
			logger.error(error)
			return {
				content: "❌ Error al añadir el rol adicional"
			}
		}
	}
}

export default AddAdditionalRoleCommand
