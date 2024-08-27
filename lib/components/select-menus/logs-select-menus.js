import { BUTTON_LABELS } from "../../../enums/interactions.js"
import logger from "../../logger/logger.js"
import { createEmbed } from "../../../utils/discord-api/components.js"
import {
	getLogEditButton
} from "../../../utils/create-components/buttons.js"
import { getLogEditChannelSelectMenu } from "../../../utils/create-components/select-menus.js"
import LogsConfig from "../../../config/logs.config.js"

const handleLogsSelectMenus = async (interaction, selectMenuId) => {
	const handlers = {
		[BUTTON_LABELS.LOGS.info]: showLogInfo,
		[BUTTON_LABELS.LOGS.editEnable]: editEnable,
		[BUTTON_LABELS.LOGS.editChannel]: editChannel
	}

	for (const [prefix, handler] of Object.entries(handlers)) {
		if (selectMenuId.startsWith(prefix)) {
			const id = selectMenuId.replace(prefix, "")
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
export default handleLogsSelectMenus

async function showLogInfo (interaction) {
	const logName = interaction.values[0]

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
		components: [
			getLogEditButton(logName)
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

async function editEnable (interaction, logName) {
	const enable = interaction.values[0] === "true"

	const logsConfig = await LogsConfig.get()
	if (!enable) {
		logsConfig[logName].enabled = false
		logsConfig[logName].channel = null
		await LogsConfig.set(logsConfig)
		return await interaction.update({
			content: "✅ Logs desactivados",
			components: []
		})
	}

	const row = [
		getLogEditChannelSelectMenu(logName)
	]
	return await interaction.update({
		content: "Selecciona el canal donde se enviarán los logs",
		components: row
	})
}

async function editChannel (interaction, logName) {
	const channelId = interaction.values[0]
	const logsConfig = await LogsConfig.get()
	logsConfig[logName].enabled = true
	logsConfig[logName].channel = channelId
	await LogsConfig.set(logsConfig)

	return await interaction.update({
		content: "✅ Logs habilitados",
		components: []
	})
}
