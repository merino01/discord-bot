import logger from "../../lib/logger/logger.js"
import MessagesFormatService from "../../services/messages-format.service.js"

const messageFormats = new Map()

export async function setCreatingMessageFormat (id, data) {
	if (
		data.name &&
		data.description &&
		data.channelId &&
		data.regex
	) {
		try {
			await MessagesFormatService.createOne(data)
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
