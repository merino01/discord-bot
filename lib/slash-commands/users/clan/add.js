import { SlashCommandSubcommandBuilder } from "discord.js"
import ClanesService from "../../../../services/clanes.service.js"
import { addRoleToUser, getRole } from "../../../../utils/discord-api/roles.js"
import { COLORS } from "../../../../enums/colors.js"
import logger from "../../../logger/logger.js"
import ClanesConfig from "../../../../config/clanes.config.js"

export default {
	liderOnly: true,
	log: true,
	logColor: COLORS.yellow,
	data: new SlashCommandSubcommandBuilder()
		.setName("add")
		.setDescription("Añade un usuario al clan")
		.addUserOption((option) => option
			.setName("usuario")
			.setDescription("Usuario")
			.setRequired(true)
		),
	execute: async (interaction) => {
		const user = interaction.options.getUser("usuario")
		const member = interaction.guild.members.cache.get(user.id)
		const author = interaction.member

		const clan = await ClanesService.getMemberClan(author)
		if (!clan) {
			return {
				content: "❗No perteneces a ningún clan"
			}
		}

		const userClan = await ClanesService.getMemberClan(member)
		if (userClan && userClan.id !== clan.id) {
			return {
				content: "❌ El usuario ya pertenece a un clan"
			}
		} else if (userClan && userClan.id === clan.id) {
			return {
				content: "❌ El usuario ya pertenece a este clan"
			}
		}

		try {
			await addAdditionalRoles({ guild: interaction.guild, user: member })
			clan.members.push(member.id)
			await ClanesService.updateOne(clan)
			await addRoleToUser(member, clan.roleId)
			return {
				content: `Usuario <@${user.id}> añadido al clan`
			}
		} catch (error) {
			logger.error("Error adding user to clan")
			logger.error(error)
			return {
				content: "❌ Ha ocurrido un error al añadir el usuario"
			}
		}
	}
}

async function addAdditionalRoles ({ guild, user }) {
	const clanesConfig = await ClanesConfig.get()
	const { additional_roles } = clanesConfig
	// Add additional roles
	if (
		Array.isArray(additional_roles) &&
		additional_roles.every((roleId) => typeof roleId === "string")
	) {
		for (const roleToAddId of additional_roles) {
			const roleToAdd = await getRole(guild, roleToAddId)
			await addRoleToUser(user, roleToAdd)
		}
	}
}
