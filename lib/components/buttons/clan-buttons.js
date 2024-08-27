import { BUTTON_LABELS } from "../../../enums/interactions.js"
import logger from "../../logger/logger.js"
import { deleteClan } from "../../slash-commands/admin/clanes/delete.js"
import ClanesService from "../../../services/clanes.service.js"
import getClanInfo, { getClanMembersList } from "../../../utils/clanes/get-clan-info.js"
import { addVoiceChannelToClan } from "../../slash-commands/admin/clanes/add-voice-channel.js"
import {
	getBackButton,
	getClanesConfirmDeleteButtons
} from "../../../utils/create-components/buttons.js"
import getAllClanesButtons, {
	getDeletedClanes
} from "../../../utils/clanes/get-all-clanes-buttons.js"
import { isMod } from "../../../utils/is-mod.js"

export async function handleClanButtons (interaction, buttonId) {
	const handlers = {
		[BUTTON_LABELS.CLANES.info]: getInfo,
		[BUTTON_LABELS.CLANES.deleteCancel]: cancelDeleteClan,
		[BUTTON_LABELS.CLANES.deleteConfirm]: confirmDeleteClan,
		[BUTTON_LABELS.CLANES.members]: getMembers,
		[BUTTON_LABELS.CLANES.delete]: deleteClanButton,
		[BUTTON_LABELS.CLANES.addVoiceChannel]: addVoiceChannel,
		[BUTTON_LABELS.CLANES.backToInfo]: getInfo,
		[BUTTON_LABELS.CLANES.backToAllDeleted]: getAllClanesDeleted,
		[BUTTON_LABELS.CLANES.backToAll]: getAllClanes
	}

	for (const [prefix, handler] of Object.entries(handlers)) {
		if (buttonId.startsWith(prefix)) {
			const id = buttonId.replace(prefix, "")
			try {
				return await handler(interaction, id)
			} catch (error) {
				logger.error(error)
				return interaction.update({
					content: "❌ Ha ocurrido un error al procesar la acción",
					components: []
				})
			}
		}
	}
}

async function cancelDeleteClan (interaction) {
	return interaction.update({
		content: "Operación cancelada",
		components: []
	})
}

async function confirmDeleteClan (interaction, clanId) {
	const response = await deleteClan(interaction, clanId)
	await interaction.update({ ...response, components: [] })
}

async function getAllClanes (interaction) {
	const buttonsRow = await getAllClanesButtons(BUTTON_LABELS.CLANES.info)
	return await interaction.update({ ...buttonsRow, embeds: [], content: "" })
}

async function getAllClanesDeleted (interaction) {
	const buttonsRow = await getDeletedClanes(BUTTON_LABELS.CLANES.info)
	return await interaction.update({ ...buttonsRow, embeds: [], content: "" })
}

async function getInfo (interaction, clanId) {
	const clan = await ClanesService.findOneById(clanId)
	if (!clan) {
		return await interaction.update({
			content: "❌ No se ha encontrado información para este clan.",
			components: []
		})
	}

	const info = await getClanInfo({ clan })

	const isAdmin = isMod(interaction.member)

	let components = info.components
	if (isAdmin) {
		if (clan.deleted || clan.archived) {
			components = info.components.concat([
				getBackButton(BUTTON_LABELS.CLANES.backToAllDeleted + clanId)
			])
		} else {
			components = info.components.concat([
				getBackButton(BUTTON_LABELS.CLANES.backToAll + clanId)
			])
		}
	}

	const response = { ...info, components }
	if (info.components.length > 0) {
		response.content = ""
	}

	await interaction.update(response)
}

async function deleteClanButton (interaction, clanId) {
	const clan = await ClanesService.findOneById(clanId)
	await interaction.update({
		content: `¿Estás seguro de que quieres borrar el clan ${clan?.name || ""}?`,
		components: [getClanesConfirmDeleteButtons(clanId)]
	})
}

async function addVoiceChannel (interaction, clanId) {
	const response = await addVoiceChannelToClan(interaction, clanId)
	await interaction.update({ ...response, components: [] })
}

async function getMembers (interaction, clanId) {
	const clan = await ClanesService.findOneById(clanId)
	if (!clan) {
		return await interaction.editReply({
			content: "❌ No se ha encontrado información para este clan.",
			components: []
		})
	}

	const members = await getClanMembersList({ clan })
	await interaction.update({
		content: members,
		embeds: [],
		components: [getBackButton(BUTTON_LABELS.CLANES.backToInfo + clanId)]
	})
}
