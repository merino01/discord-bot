import { SlashCommandSubcommandBuilder } from "discord.js"
import ClanesService from "../../../../services/clanes.service.js"
import { getRole, removeRoleFromUser } from "../../../../utils/discord-api/roles.js"
import { COLORS } from "../../../../enums/colors.js"
import logger from "../../../logger/logger.js"

const KickUserCommand = {
	liderOnly: true,
	log: true,
	logColor: COLORS.yellow,
	command: new SlashCommandSubcommandBuilder()
		.setName("kick")
		.setDescription("Expulsa a un usuario del clan")
		.addUserOption((option) => option
			.setName("usuario")
			.setDescription("Usuario")
			.setRequired(true)
		),
	execute: async (interaction) => {
		const user = interaction.options.getUser("usuario")
		const member = interaction.guild.members.cache.get(user.id)
		const author = interaction.member
		const { guild } = interaction

		const clan = await ClanesService.getMemberClan(author)
		if (!clan) {
			return await interaction.reply({
				content: "❗No perteneces a ningún clan",
				ephemeral: true
			})
		}

		const userClan = await ClanesService.getMemberClan(member)
		if (!userClan) {
			return await interaction.reply({
				content: "❌ El usuario no pertenece a ningún clan",
				ephemeral: true
			})
		} else if (userClan && userClan.id !== clan.id) {
			return await interaction.reply({
				content: "❌ El usuario pertenece a otro clan",
				ephemeral: true
			})
		}

		try {
			await removeAdditionalRoles({ guild, user: member, clan })
			const role = await getRole(guild, clan.roleId)
			await removeRoleFromUser(member, role.id)
			userClan.members.splice(userClan.members.indexOf(member.id), 1)
			await ClanesService.updateOne(userClan)
			return await interaction.reply({
				content: "✅ Usuario expulsado correctamente",
				ephemeral: true
			})
		} catch (error) {
			logger.error("Error kicking user from clan")
			logger.error(error)
			return await interaction.reply({
				content: "❌ Ha ocurrido un error al expulsar el usuario",
				ephemeral: true
			})
		}
	}
}

export default KickUserCommand

async function removeAdditionalRoles ({ guild, user, clan }) {
	const { additional_roles } = clan
	// Remove additional roles
	if (
		Array.isArray(additional_roles) &&
		additional_roles.every((roleId) => typeof roleId === "string")
	) {
		for (const roleToRemoveId of additional_roles) {
			const roleToRemove = await getRole(guild, roleToRemoveId)
			await removeRoleFromUser(user, roleToRemove.id)
		}
	}
}
