import logger from "../logger/logger.js"
import { COLORS } from "../../enums/colors.js"
import { checkMessageFormat } from "./message-create.js"
import { createEmbed } from "../../utils/discord-api/components.js"
import TriggersService from "../../services/triggers.service.js"
import LogsConfig from "../../config/logs.config.js"

const MessageUpdate = async (_, oldMessage, newMessage) => {
	if (newMessage.author.bot) { return }
	logger.info("Event received: 'MessageUpdate'")

	const { content: oldContent } = oldMessage
	const { guild, channel, content: newContent, author } = newMessage
	const logsConfig = await LogsConfig.get()
	const { chatlog } = logsConfig

	if (oldContent === newContent) { return }

	checkMessageFormat(newMessage)
	TriggersService.check(newMessage)

	try {
		if (chatlog.enabled && chatlog.channel) {
			const logEmbed = createEmbed({
				title: "Mensaje editado",
				fields: [
					{
						name: "Autor",
						value: `<@${author.id}> - ${author.tag}`,
						inline: true
					},
					{
						name: "Mensaje anterior",
						value: oldContent,
						inline: true
					},
					{
						name: "Mensaje nuevo",
						value: newContent,
						inline: true
					},
					{
						name: "Canal",
						value: `<#${channel.id}> - ${channel.name}`,
						inline: true
					}
				],
				color: COLORS.yellow,
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
			old_messsage: oldContent,
			new_message: newContent,
			channel: {
				id: channel.id,
				name: channel.name
			}
		}

		logger.info("Message updated")
		logger.data(log)
	} catch (error) {
		logger.error("Error on event MessageUpdate")
		logger.error(error)
	}
}

export default MessageUpdate
