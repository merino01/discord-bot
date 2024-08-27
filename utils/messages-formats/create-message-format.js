import logger from "../../lib/logger/logger.js"
import MessageFormatsService from "../../services/message-formats.service.js"

const messageFormats = new Map()

export async function setCreatingMessageFormat (id, data) {
	if (
		data.name &&
		data.description &&
		data.channelId &&
		data.regex
	) {
		try {
			await MessageFormatsService.insertOne({ ...data, id })
			messageFormats.delete(id)
		} catch (error) {
			logger.error(error)
		}
	} else {
		messageFormats.set(id, data)
	}
}

export function getCreatingMessageFormat (id) {
	return messageFormats.get(id) || {}
}
