import { SlashCommandSubcommandBuilder } from "discord.js"
import ClanesService from "../../../../services/clanes.service.js"
import logger from "../../../logger/logger.js"
import { COLORS } from "../../../../enums/colors.js"
import { createRole, addRoleToUser, getRole } from "../../../../utils/discord-api/roles.js"
import { createChannel } from "../../../../utils/discord-api/channels.js"
import { randomUUID } from "node:crypto"
import {
	getTextChannelOptions,
	getVoiceChannelOptions
} from "../../../../utils/clanes/get-channels-permissions.js"
import ClanesConfig from "../../../../config/clanes.config.js"

const CreateCommand = {
	defer: true,
	data: new SlashCommandSubcommandBuilder()
		.setName("create")
		.setDescription("Crea un nuevo clan")
		.addStringOption((option) => option
			.setName("icono")
			.setDescription("Icono del clan")
			.setRequired(true)
		)
		.addStringOption((option) => option
			.setName("nombre")
			.setDescription("Nombre del clan")
			.setRequired(true)
		)
		.addUserOption((option) => option
			.setName("lider")
			.setDescription("Líder del clan")
			.setRequired(true)
		),

	execute: async (interaction) => {
		const { guild } = interaction

		const liderUser = interaction.options.getUser("lider")
		const icon = interaction.options.getString("icono")
		const nombre = interaction.options.getString("nombre")

		const lider = await guild.members.fetch(liderUser.id)
		if (!lider) {
			return {
				content: "❌ No se ha encontrado al líder"
			}
		}

		const newClan = {
			id: randomUUID(),
			guild: {
				name: guild.name,
				id: guild.id
			},
			name: `${icon} ${nombre}`,
			liders: [lider.id]
		}

		try {
			const clanesConfig = await ClanesConfig.get()

			const role = await createRole(guild, {
				name: newClan.name,
				color: COLORS.blue
			})
			await addRoleToUser(lider, role)
			await addAdditionalRoles({ guild, lider })

			const everyoneRole = guild.roles.everyone.id
			const textChannelOptions = await getTextChannelOptions({
				clanName: newClan.name,
				roleId: role.id,
				everyoneRoleId: everyoneRole
			})
			const voiceChannelOptions = await getVoiceChannelOptions({
				clanName: newClan.name,
				roleId: role.id,
				everyoneRoleId: everyoneRole
			})

			const textChannel = await createChannel(guild, textChannelOptions)
			const voiceChannel = await createChannel(guild, voiceChannelOptions)

			newClan.roleId = role.id
			newClan.textChannelIds = [textChannel.id]
			newClan.voiceChannelIds = [voiceChannel.id]
			newClan.lider_roles = clanesConfig.lider_roles
			newClan.additional_roles = clanesConfig.additional_roles
			newClan.text_parent_id = clanesConfig.text_parent_id
			newClan.voice_parent_id = clanesConfig.voice_parent_id
			newClan.guild = clanesConfig.guild
			await ClanesService.insertOne(newClan)

			logger.info(
				`Clan '${newClan.name}' created by ` +
				`'${interaction.user.username}' (${interaction.user.id})`
			)
			logger.data(newClan)
			return {
				content: `✅ Clan \`${newClan.name}\` creado correctamente`
			}
		} catch (error) {
			logger.error("Error on creating clan")
			logger.error(error)
			return {
				content: "❌ Ha habido un error al crear el clan"
			}
		}
	}
}

export default CreateCommand

async function addAdditionalRoles ({ guild, lider }) {
	const clanesConfig = await ClanesConfig.get()
	const additional_roles = clanesConfig.additional_roles.filter(Boolean)
	const lider_roles = clanesConfig.lider_roles.filter(Boolean)
	// Add additional roles
	if (
		Array.isArray(additional_roles) &&
		additional_roles.every((roleId) => typeof roleId === "string")
	) {
		for (const roleToAddId of additional_roles) {
			const roleToAdd = await getRole(guild, roleToAddId)
			if (!roleToAdd) {
				continue
			}
			await addRoleToUser(lider, roleToAdd)
		}
	}

	// Add lider roles
	if (
		Array.isArray(lider_roles) &&
		lider_roles.every((roleId) => typeof roleId === "string")
	) {
		for (const roleToAddId of lider_roles) {
			const roleToAdd = await getRole(guild, roleToAddId)
			if (!roleToAdd) {
				continue
			}
			await addRoleToUser(lider, roleToAdd)
		}
	}
}
