import logger from "../logger/logger.js"
import { COLORS } from "../../enums/colors.js"
import { createEmbed } from "../../utils/discord-api/components.js"
import LogsConfig from "../../config/logs.config.js"

const MessageDelete = async (_, message) => {
	if (message.author.bot) { return }
	logger.info("Event received: 'MessageDelete'")

	const { guild, channel, content, author } = message
	const logsConfig = await LogsConfig.get()
	const { chatlog } = logsConfig

	try {
		if (chatlog.enabled && chatlog.channel) {
			const logEmbed = createEmbed({
				title: "Mensaje eliminado",
				fields: [
					{
						name: "Autor",
						value: `<@${author.id}> - ${author.tag}`,
						inline: true
					},
					{
						name: "Mensaje",
						value: content,
						inline: true
					},
					{
						name: "Canal",
						value: `<#${channel.id}> - ${channel.name}`,
						inline: true
					}
				],
				color: COLORS.red,
				timestamp: true
			})

			const logChannel = guild.channels.cache.get(chatlog.channel)
			logChannel.send({ embeds: [logEmbed] })
		}

		const log = {
			author: {
				id: author.id,
				user: author.tag
			},
			content,
			channel: {
				id: channel.id,
				name: channel.name
			}
		}

		logger.info("Message deleted")
		logger.data(log)

	} catch (error) {
		logger.error("Error on event MessageDelete")
		logger.error(error)
	}
}

export default MessageDelete
