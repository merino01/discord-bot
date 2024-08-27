import { SlashCommandSubcommandBuilder } from "discord.js"
import ClanesService from "../../../../services/clanes.service.js"
import logger from "../../../logger/logger.js"
import { deleteRole, getRole, removeRoleFromUser } from "../../../../utils/discord-api/roles.js"
import { deleteChannel, getChannel } from "../../../../utils/discord-api/channels.js"
import { COLORS } from "../../../../enums/colors.js"
import { BUTTON_LABELS } from "../../../../enums/interactions.js"
import getAllClanesButtons from "../../../../utils/clanes/get-all-clanes-buttons.js"
import ClanesConfig from "../../../../config/clanes.config.js"

const DeleteCommand = {
	log: true,
	logColor: COLORS.red,
	command: new SlashCommandSubcommandBuilder()
		.setName("delete")
		.setDescription("Borra un clan"),

	execute: async () => {
		try {
			const clanesButtons = await getAllClanesButtons(BUTTON_LABELS.CLANES.delete)
			return clanesButtons
		} catch (error) {
			logger.error("Error on deleting clan")
			logger.error(error)
			return {
				content: "❌ Ha habido un error al intentar borrar el clan"
			}
		}
	}
}

export default DeleteCommand

export async function deleteClan (interaction, clanId) {
	const clan = await ClanesService.findOneById(clanId)
	if (!clan) {
		logger.error(
			`Clan with ID '${clanId}' not found. ` +
			`Searched by ${interaction.user.tag} (${interaction.user.id})`
		)
		return {
			content: `❌ No se ha encontrado el clan con el ID \`${clanId}\``
		}
	}

	const { guild } = interaction
	const { roleId, textChannelIds, voiceChannelIds } = clan

	await removeRoles({ guild, clan })
	await deleteRole(guild, roleId)

	const clanesConfig = await ClanesConfig.get()
	if (clanesConfig.archive) {
		const archived = await archiveTextChannels({ guild, textChannelIds })
		if (archived === "error") {
			return {
				content: "❌ No se ha podido archivar los canales de texto"
			}
		}
		for (const channel of voiceChannelIds) {
			await deleteChannel(guild, channel)
		}
	} else {
		for (const channel of [...textChannelIds, ...voiceChannelIds]) {
			await deleteChannel(guild, channel)
		}
	}
	await ClanesService.deleteOneById(clan.id)

	logger.info(`Clan '${clan.name}' deleted`)
	logger.data(clan)
	return {
		content: `✅ Clan \`${clan.name}\` borrado correctamente`
	}
}

async function removeRoles ({ guild, clan }) {
	const { additional_roles, lider_roles, roleId: clan_role } = clan
	const clanMembers = guild.roles.cache
		.get(clan_role)?.members
		.map((member) => guild.members.cache.get(member.id))
	if (!clanMembers) {
		return
	}

	// Remove additional roles
	for (const roleId of additional_roles.filter(Boolean)) {
		const role = await getRole(guild, roleId)

		for (const member of clanMembers) {
			await removeRoleFromUser(member, role.id)
			logger.info(`Role '${role.name}' removed from user '${member.user.tag}'`)
		}
	}

	// Remove lider roles
	for (const roleId of lider_roles.filter(Boolean)) {
		const role = await getRole(guild, roleId)

		for (const member of clanMembers) {
			await removeRoleFromUser(member, role.id)
			logger.info(`Role '${role.name}' removed from user '${member.user.tag}'`)
		}
	}
}

async function archiveTextChannels ({ guild, textChannelIds }) {
	const clanesConfig = await ClanesConfig.get()
	const { archived_parent_id } = clanesConfig
	if (!archived_parent_id) {
		return "error"
	}

	for (const channelId of textChannelIds) {
		const channel = await getChannel(guild, channelId)
		if (!channel) {
			continue
		}
		await channel.setParent(archived_parent_id)
		await channel.lockPermissions()
		await channel.setName(`archivado-${channel.name}`)
	}
}
