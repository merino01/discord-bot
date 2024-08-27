import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
import { createEmbed } from "../discord-api/components.js"
import { BUTTON_LABELS } from "../../enums/interactions.js"
import getGuild from "../get-guild.js"

// eslint-disable-next-line max-lines-per-function
export default async function getClanInfo ({ clan }) {
	const {
		name,
		liders,
		textChannelIds,
		voiceChannelIds,
		archived,
		deleted,
		archived_at,
		deleted_at
	} = clan

	const lideres = liders
		.map((lider) => `<@${lider}>`)
		.join(", ")

	const channels = {
		text: textChannelIds
			.map((textChannelId) => `<#${textChannelId}>`)
			.join(", "),
		voice: voiceChannelIds
			.map((voiceChannelId) => `<#${voiceChannelId}>`)
			.join(", ")
	}

	const members = getMembersCount({ clan })

	const creationDate = new Date(clan.created_at).toLocaleString("es-ES")
	const roleId = clan.roleId ? `<@&${clan.roleId}>` : "No asignado"

	const fields = [
		{
			name: "Nombre",
			value: name,
			inline: true
		},
		{
			name: "Fecha de creación",
			value: creationDate,
			inline: true
		}
	]

	if (archived || deleted) {
		const f = archived
			? new Date(archived_at).toLocaleString("es-ES")
			: new Date(deleted_at).toLocaleString("es-ES")
		fields.push(
			{
				name: "Estado",
				value: archived
					? "Archivado"
					: "Eliminado",
				inline: true
			},
			{
				name: archived
					? "Fecha de archivación"
					: "Fecha de eliminación",
				value: f,
				inline: true
			}
		)
	} else {
		fields.push(
			{
				name: "Estado",
				value: "Activo",
				inline: true
			},
			{
				name: "Líderes",
				value: lideres,
				inline: true
			},
			{
				name: "Rol",
				value: roleId,
				inline: true
			},
			{
				name: "Canales de texto",
				value: channels.text,
				inline: true
			},
			{
				name: "Canales de voz",
				value: channels.voice,
				inline: true
			},
			{
				name: "Miembros",
				value: `${members}`,
				inline: true
			}
		)
	}

	return {
		embeds: [
			createEmbed({
				title: "Información del clan",
				fields
			})
		],
		components: [
			new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`${BUTTON_LABELS.CLANES.members}${clan.id}`)
						.setLabel("Ver miembros")
						.setStyle(ButtonStyle.Secondary)
				)
		]
	}
}

export async function getClanMembersList ({ clan }) {
	const guild = getGuild()

	const members = await guild.members.fetch()
	const clanMembers = members.filter((member) => {
		const roles = member.roles.cache
		return roles.some((role) => role.id === clan.roleId)
	})

	return Array.from(clanMembers.values())
		.map((member, i) => {
			const { user } = member
			return `${i}. <@${user.id}> (${user.tag})`
		})
		.join("\n") ||
    "No hay miembros en el clan"
}

export function getMembersCount ({ clan }) {
	const guild = getGuild()

	const members = guild.members.cache
	const clanMembers = members.filter((member) => {
		const roles = member.roles.cache
		return roles.some((role) => role.id === clan.roleId)
	})

	return clanMembers.size
}
