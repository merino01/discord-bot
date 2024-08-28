import {
	getLogsEnableSelectMenu,
	getLogsSelect
} from "../../../utils/create-components/select-menus.js"
import logger from "../../logger/logger.js"
import { BUTTON_LABELS } from "../../../enums/interactions.js"
import { getBackButton, getLogEditButton } from "../../../utils/create-components/buttons.js"
import { createEmbed } from "../../../utils/discord-api/components.js"
import LogsConfig from "../../../config/logs.config.js"

export async function handleLogsButtons (interaction, buttonId) {
	const handlers = {
		[BUTTON_LABELS.LOGS.edit]: edit,
		[BUTTON_LABELS.LOGS.backToShowLogs]: logsSelect,
		[BUTTON_LABELS.LOGS.backToLogInfo]: logInfo
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

async function edit (interaction, logName) {
	const rows = [
		getLogsEnableSelectMenu(logName)
	]

	await interaction.update({
		embeds: [],
		components: rows
	})
}

async function logsSelect (interaction) {
	return await interaction.update({
		content: "",
		embeds: [],
		components: [
			getLogsSelect()
		]
	})
}

async function logInfo (interaction, logName) {
	const logsConfig = await LogsConfig.get()

	const logConfig = logsConfig[logName]
	if (!logConfig) {
		return await interaction.update({
			content: "❌ No se ha encontrado la configuración de logs",
			components: []
		})
	}

	const { channel, enabled } = logConfig
	const status = enabled ? "Activado" : "Desactivado"
	const chan = `<#${channel}>`

	return await interaction.update({
		content: "",
		components: [
			getLogEditButton(logName),
			getBackButton(BUTTON_LABELS.LOGS.backToShowLogs)
		],
		embeds: [
			createEmbed({
				title: `${logName} logs`,
				description: `**Estado** ${status}` +
					(enabled
						? `\n**Canal** ${chan}`
						: "")
			})
		]
	})
}
