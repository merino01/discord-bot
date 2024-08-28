import {
	ActionRowBuilder,
	ChannelSelectMenuBuilder,
	ChannelType,
	StringSelectMenuBuilder
} from "discord.js"
import { BUTTON_LABELS } from "../../enums/interactions.js"
import { TRIGGER_ACTIONS, TRIGGER_TEXT_POSITIONS } from "../../enums/triggers.js"

/** LOGS */
export const getLogEditChannelSelectMenu = (logName) => new ActionRowBuilder()
	.addComponents(
		new ChannelSelectMenuBuilder()
			.setCustomId(BUTTON_LABELS.LOGS.editChannel + logName)
			.setPlaceholder("Selecciona el canal")
			.setChannelTypes(ChannelType.GuildText)
	)

export const getLogsEnableSelectMenu = (logName) => new ActionRowBuilder()
	.addComponents(
		new StringSelectMenuBuilder()
			.setCustomId(BUTTON_LABELS.LOGS.editEnable + logName)
			.setPlaceholder("¿Habilitar?")
			.addOptions([
				{
					label: "Sí",
					value: "true"
				},
				{
					label: "No",
					value: "false"
				}
			])
	)

export const getLogsSelect = () => new ActionRowBuilder()
	.addComponents(
		new StringSelectMenuBuilder()
			.setCustomId(BUTTON_LABELS.LOGS.info)
			.setPlaceholder("Selecciona el tipo de logs")
			.addOptions([
				{
					label: "Chat",
					value: "chatlog"
				},
				{
					label: "Voz",
					value: "voicelog"
				},
				{
					label: "Clanes",
					value: "claneslog"
				},
				{
					label: "Comandos",
					value: "commandlog"
				}
			])
	)

/** CLANES */

/** MESSAGE FORMATS */
export const getMessageFormatChannelSelect = (formatId) => new ActionRowBuilder()
	.addComponents(new ChannelSelectMenuBuilder()
		.setCustomId(`${BUTTON_LABELS.MESSAGES_FORMATS.createChannel}${formatId}`)
		.setPlaceholder("Selecciona el canal")
		.setChannelTypes(ChannelType.GuildText)
	)

/** TRIGGERS */
export const getTriggersCreateFormSelects = (triggerId) => [
	new ActionRowBuilder()
		.addComponents(
			new StringSelectMenuBuilder()
				.setCustomId(`${BUTTON_LABELS.TRIGGERS.createAction}${triggerId}`)
				.setPlaceholder("Selecciona una acción")
				.addOptions([
					{
						label: "Responder",
						value: TRIGGER_ACTIONS.reply
					},
					{
						label: "Eliminar",
						value: TRIGGER_ACTIONS.delete
					}
				])
		),
	new ActionRowBuilder()
		.addComponents(
			new StringSelectMenuBuilder()
				.setCustomId(`${BUTTON_LABELS.TRIGGERS.createPosition}${triggerId}`)
				.setPlaceholder("Selecciona una posición")
				.addOptions([
					{
						label: "Contiene",
						value: TRIGGER_TEXT_POSITIONS.contains
					},
					{
						label: "Empieza por",
						value: TRIGGER_TEXT_POSITIONS.startsWith
					},
					{
						label: "Termina en",
						value: TRIGGER_TEXT_POSITIONS.endsWith
					},
					{
						label: "Es igual a",
						value: TRIGGER_TEXT_POSITIONS.exactMatch
					},
					{
						label: "Alrededor de texto",
						value: TRIGGER_TEXT_POSITIONS.textBetween
					}
				])
		),
	new ActionRowBuilder()
		.addComponents(
			new StringSelectMenuBuilder()
				.setCustomId(`${BUTTON_LABELS.TRIGGERS.createSensible}${triggerId}`)
				.setPlaceholder("¿Es sensible a mayúsculas?")
				.addOptions([
					{
						label: "Sí",
						value: "true"
					},
					{
						label: "No",
						value: "false"
					}
				])
		)
]

/** CHANNELS AUTOMATIC MESSAGES */
export const getAutomaticMessageChannelSelect = (autoMsgId) => new ActionRowBuilder()
	.addComponents(
		new ChannelSelectMenuBuilder()
			.setCustomId(
				BUTTON_LABELS.AUTOMATIC_MESSAGES.categorySelect +
				autoMsgId
			)
			.setPlaceholder("Selecciona la categoría")
			.setChannelTypes(ChannelType.GuildCategory)
	)
