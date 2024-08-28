import LogsConfig from "../../config/logs.config.js"
import { getChannel } from "../../utils/discord-api/channels.js"
import { createEmbed } from "../../utils/discord-api/components.js"

const logClanCommandToChannel = async ({ userId, fields, command, color }) => {
	const logsConfig = await LogsConfig.get()
	const { claneslog } = logsConfig
	if (!claneslog.enabled) { return }

	const channel = await getChannel(claneslog.channel)
	if (!channel) { return }

	channel.send({
		embeds: [
			createEmbed({
				title: "Comando de clan",
				description: `\`${command}\`\n\n<@${userId}>`,
				fields,
				color
			})
		]
	})
}

export default logClanCommandToChannel
