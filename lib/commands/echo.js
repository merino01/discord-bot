import logger from "../logger/logger.js"
import { createEmbed } from "../../utils/discord-api/components.js"
import config from "../../config/config.js"

const Echo = {
	name: "echo",
	description: "Envía un mensaje con el bot a cualquier canal del servidor",
	roles: [config.moderator_role_id],
	execute: async (message) => {
		const channelToSend = message.mentions.channels.first() || message.channel

		try {
			const prevMessage = await message.channel.messages.fetch({ limit: 2 })
			const lastMessage = prevMessage.last()
			const text = lastMessage.content
			const attachments = lastMessage.attachments.map((attachment) => attachment.url)

			const response = formatText(text)

			channelToSend.send({
				...response,
				files: attachments
			})

			await message.channel.send({ content: `✅ Mensaje enviado a <#${channelToSend.id}>` })
			await message.delete()
		} catch (error) {
			logger.error(error)
			message.reply({ content: "Error al enviar el mensaje" })
		}
	}
}

export default Echo

function formatText (text) {
	if (!text.startsWith("{embed}")) {
		return { content: text }
	}

	const title = extractTextBetween(text, "{title}", "{endtitle}") || "Sin título"
	const description = extractTextBetween(
		text,
		"{description}",
		"{enddescription}"
	) || "Sin descripción"
	const color = extractTextBetween(text, "{color}", "{endcolor}")

	return {
		embeds: [
			createEmbed({
				title,
				description,
				color: formatColor(color)
			})
		]
	}
}

function extractTextBetween (text, startDelimiter, endDelimiter) {
	const regex = new RegExp(`${startDelimiter}(.*?)${endDelimiter}`, "s")
	const match = text.match(regex)
	return match ? match[1].trim() : null
}

function formatColor (hex) {
	if (!hex) {
		return undefined
	}

	if (hex.startsWith("#")) {
		hex = hex.slice(1)
	}
	const color = parseInt(hex, 16)
	return isNaN(color) ? undefined : color
}
