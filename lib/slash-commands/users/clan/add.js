import { SlashCommandSubcommandBuilder } from "discord.js"
import ClanesService from "../../../../services/clanes.service.js"
import { addRoleToUser, getRole } from "../../../../utils/discord-api/roles.js"
import { COLORS } from "../../../../enums/colors.js"
import logger from "../../../logger/logger.js"
import ClanesConfig from "../../../../config/clanes.config.js"
import logClanCommandToChannel from "../../../../utils/clanes/log-to-channel.js"
import isLider from "../../../../utils/clanes/is-lider.js"

export default {
	defer: true,
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

		if (! await isLider(author, clan)) {
			return {
				content: "❌ Solo los líderes pueden usar este comando"
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

			logClanCommandToChannel({
				userId: author.id,
				command: "/clan add",
				fields: [
					{ name: "usuario", value: `<@${user.id}>` },
					{ name: "clan", value: `<@&${clan.roleId}>` }
				],
				color: COLORS.yellow
			})
			return {
				content: `¡Bienvenido al clan <@${user.id}>! 👋`
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
