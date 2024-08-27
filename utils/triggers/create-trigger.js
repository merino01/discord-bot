import TriggersService from "../../services/triggers.service.js"
import logger from "../../lib/logger/logger.js"

const triggers = new Map()

export async function setCreatingTrigger (id, data) {
	if (
		data.name &&
		data.description &&
		data.key &&
		data.action &&
		data.sensible &&
		data.position
	) {
		try {
			await TriggersService.insertOne({ ...data, id })
			triggers.delete(id)
		} catch (error) {
			logger.error(error)
		}
	} else {
		triggers.set(id, data)
	}
}

export function getCreatingTrigger (id) {
	return triggers.get(id) || {}
}
