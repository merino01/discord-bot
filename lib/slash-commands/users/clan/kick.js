import { SlashCommandSubcommandBuilder } from "discord.js"
import ClanesService from "../../../../services/clanes.service.js"
import { getRole, removeRoleFromUser } from "../../../../utils/discord-api/roles.js"
import { COLORS } from "../../../../enums/colors.js"
import logger from "../../../logger/logger.js"
import logClanCommandToChannel from "../../../../utils/clanes/log-to-channel.js"
import isLider from "../../../../utils/clanes/is-lider.js"

export default {
	data: new SlashCommandSubcommandBuilder()
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
			return {
				content: "❗No perteneces a ningún clan"
			}
		}

		if (! await isLider(author, clan)) {
			return {
				content: "❌ Solo los líderes pueden usar este comando"
			}
		}

		const userClan = await ClanesService.getMemberClan(member)
		if (!userClan) {
			return {
				content: "❌ El usuario no pertenece a ningún clan"
			}
		} else if (userClan && userClan.id !== clan.id) {
			return {
				content: "❌ El usuario pertenece a otro clan"
			}
		}

		try {
			await removeAdditionalRoles({ guild, user: member, clan })
			const role = await getRole(guild, clan.roleId)
			await removeRoleFromUser(member, role.id)
			userClan.members.splice(userClan.members.indexOf(member.id), 1)
			await ClanesService.updateOne(userClan)

			logClanCommandToChannel({
				userId: author.id,
				command: "/clan kick",
				fields: [
					{ name: "Usuario", value: `<@${user.id}>` },
					{ name: "Clan", value: `<@&${clan.roleId}>` }
				],
				color: COLORS.red
			})
			return {
				content: `Adiós <@${user.id}> 👊`
			}
		} catch (error) {
			logger.error("Error kicking user from clan")
			logger.error(error)
			return {
				content: "❌ Ha ocurrido un error al expulsar el usuario"
			}
		}
	}
}

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
