import logger from "../logger/logger.js"
import { createEmbed } from "../../utils/discord-api/components.js"
import AutomaticMessagesService from "../../services/auto-messages.service.js"
import { ONE_SECOND } from "../../utils/time.js"

const ChannelCreate = (_, channel) => {
	const { parentId } = channel
	logger.info("Event received: 'ChannelCreate'")
	logger.data({
		id: channel.id,
		name: channel.name,
		parentId,
		parentName: channel.parent?.name
	})

	try {
		checkChannelMessages({ parentId, channel })
	} catch (error) {
		logger.error("Error on event ChannelCreate => " + channel.name)
		logger.error(error)
	}
}

export default ChannelCreate

async function checkChannelMessages ({ parentId, channel }) {
	const channelMessage = await AutomaticMessagesService.findOneByCategory(parentId)
	if (!channelMessage) {
		return
	}

	const variables = {
		"{channelName}": channel.name,
		"{channelMention}": `<#${channel.id}>`,
		"{categoryName}": channel.parent?.name,
		"{categoryMention}": channel.parent ? `<#${channel.parent.id}>` : "",
		"{date}": new Date().toLocaleDateString("es-ES")
	}

	let { title, message, color, timeout } = channelMessage
	for (const variable in variables) {
		title = title.replaceAll(variable, variables[variable])
		message = message.replaceAll(variable, variables[variable])
	}

	const embedOptions = {
		title,
		description: message
	}
	if (color) {
		if (color.startsWith("#")) {
			color = color.slice(1)
		}
		color = parseInt(color, 16)
		embedOptions.color = color
	}

	const embed = createEmbed(embedOptions)

	if (timeout) {
		timeout = timeout * ONE_SECOND
		setTimeout(async () => {
			await channel.send({ embeds: [embed] })
		}, timeout)
	} else {
		await channel.send({ embeds: [embed] })
	}
}
