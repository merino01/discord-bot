import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle
} from "discord.js"
import { BUTTON_LABELS } from "../../enums/interactions.js"

/** LOGS */
export const getLogEditButton = (logName) => new ActionRowBuilder()
	.addComponents(
		new ButtonBuilder()
			.setCustomId(BUTTON_LABELS.LOGS.edit + logName)
			.setLabel("Editar")
			.setStyle(ButtonStyle.Primary)
	)

/** CLANES */
export const getClanesConfirmDeleteButtons = (clanId) => new ActionRowBuilder()
	.addComponents(
		new ButtonBuilder()
			.setCustomId(`${BUTTON_LABELS.CLANES.deleteConfirm}${clanId}`)
			.setLabel("Confirmar")
			.setStyle(ButtonStyle.Danger),
		new ButtonBuilder()
			.setCustomId(`${BUTTON_LABELS.CLANES.deleteCancel}${clanId}`)
			.setLabel("Cancelar")
			.setStyle(ButtonStyle.Secondary)
	)

/** TRIGGERS */

/** MESSAGE FORMATS */

/** COMMONS */
export const getBackButton = (buttonId) => new ActionRowBuilder()
	.addComponents(
		new ButtonBuilder()
			.setCustomId(buttonId)
			.setLabel("Atrás")
			.setStyle(ButtonStyle.Secondary)
	)
