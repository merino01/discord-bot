import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
import ClanesService from "../../services/clanes.service.js"
import { getMembersCount } from "./get-clan-info.js"

export default async function (idPrefix) {
	const clanes = await ClanesService.findAll()
	if (!clanes.length) {
		return {
			content: "❌ No hay clanes registrados"
		}
	}

	const buttons = []
	for (const clan of clanes) {
		const clanMembersCount = getMembersCount({ clan })
		let buttonStyle = ButtonStyle.Primary

		if (clanMembersCount > 19 && clanMembersCount < 30) {
			buttonStyle = ButtonStyle.Secondary
		} else if (clanMembersCount >= 30) {
			buttonStyle = ButtonStyle.Danger
		}

		buttons.push(new ButtonBuilder()
			.setCustomId(`${idPrefix}${clan.id}`)
			.setLabel(`${clan.name} (${clanMembersCount})`)
			.setStyle(buttonStyle)
		)
	}

	return createRows(buttons)
}

export const getDeletedClanes = async (idPrefix) => {
	const clanes = await ClanesService.findAllDeleted()
	if (!clanes.length) {
		return {
			content: "❌ No hay clanes eliminados"
		}
	}

	const buttons = []
	for (const clan of clanes) {
		buttons.push(new ButtonBuilder()
			.setCustomId(`${idPrefix}${clan.id}`)
			.setLabel(clan.name)
			.setStyle(ButtonStyle.Danger)
		)
	}
	const row = new ActionRowBuilder().addComponents(buttons)
	return {
		components: [row]
	}
}

function createRows (buttons) {
	const rows = []
	for (let i = 0; i < buttons.length; i += 5) {
		const row = new ActionRowBuilder().addComponents(buttons.slice(i, i + 5))
		rows.push(row)
	}
	return {
		components: rows
	}
}
