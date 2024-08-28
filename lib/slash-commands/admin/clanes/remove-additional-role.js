import { SlashCommandSubcommandBuilder } from "discord.js"
import logger from "../../../logger/logger.js"
import ClanesConfig from "../../../../config/clanes.config.js"
import logClanCommandToChannel from "../../../../utils/clanes/log-to-channel.js"
import { COLORS } from "../../../../enums/colors.js"

const RemoveAdditionalRoleCommand = {
	data: new SlashCommandSubcommandBuilder()
		.setName("removeadditionalrole")
		.setDescription("Quita un rol adicional de los clanes")
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

			clanesConfig.additional_roles = additional_roles.filter((roleId) => roleId !== role.id)
			await ClanesConfig.set(clanesConfig)

			logClanCommandToChannel({
				userId: interaction.member.id,
				command: "/admin clanes removeadditionalrole",
				fields: [
					{ name: "Rol", value: `<@&${role.id}>` }
				],
				color: COLORS.red
			})
			return {
				content: `✅ Rol <@&${role.id}> quitado de los roles adicionales`
			}
		} catch (error) {
			logger.error("Error removing additional role")
			logger.error(error)
			return {
				content: "❌ Error al quitar el rol adicional"
			}
		}
	}
}

export default RemoveAdditionalRoleCommand
