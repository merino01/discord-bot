import { TRIGGER_ACTIONS, TRIGGER_TEXT_POSITIONS } from "../enums/triggers.js"
import logger from "../lib/logger/logger.js"
import { formatText } from "../utils/format-message-from-text.js"
import api from "../lib/api.js"

const url = "triggers/"

const get = async () => api.GET(url)
const getOneById = async (id) => api.GET(url + id)

const createOne = async (newTrigger) => {
	const { id, name, description, key, sensible, action, reply, position } = newTrigger
	return await api.POST(url, {
		id,
		name,
		description,
		key,
		case_sensitive: sensible === "true",
		action,
		reply,
		text_position: position
	})
}

const deleteOneById = async (triggerId) => api.DELETE(url + triggerId)

const check = async (message) => {
	const trigger = await findTrigger(message.content)
	if (!trigger) { return }

	logger.info("Trigger found")
	logger.data({
		trigger,
		message: message.content,
		author: {
			user: message.author.tag,
			id: message.author.id
		},
		channel: {
			id: message.channel.id,
			name: message.channel.name
		}
	})

	const { action, reply } = trigger

	switch (action) {
	case TRIGGER_ACTIONS.delete:
		message.delete()
		break
	case TRIGGER_ACTIONS.reply:
		if (!reply) { return }
		message.reply(formatText(reply))
		break
	}
}

async function findTrigger (content) {
	const triggers = await get()
	if (!triggers) { return null }
	const foundTrigger = triggers.find((_trigger) => {
		const { key, case_sensitive, text_position } = _trigger

		let match = false
		let contentToCheck = content
		let keyToCheck = key

		if (!case_sensitive) {
			contentToCheck = content.toLowerCase()
			keyToCheck = key.toLowerCase()
		}

		if (text_position === TRIGGER_TEXT_POSITIONS.contains) {
			match = contentToCheck.includes(keyToCheck)
		} else if (text_position === TRIGGER_TEXT_POSITIONS.startsWith) {
			match = contentToCheck.startsWith(keyToCheck)
		} else if (text_position === TRIGGER_TEXT_POSITIONS.endsWith) {
			match = contentToCheck.endsWith(keyToCheck)
		} else if (text_position === TRIGGER_TEXT_POSITIONS.exactMatch) {
			match = contentToCheck === keyToCheck
		} else if (text_position === TRIGGER_TEXT_POSITIONS.textBetween) {
			const regexPattern = key.split(" ")
				.map((word) => word.trim())
				.filter((word) => word.length > 0)
				.join(".*")
			const regex = new RegExp(regexPattern, "i")
			match = regex.test(contentToCheck)
		} else {
			match = true
		}

		return match
	})

	return foundTrigger
}

const TriggersService = {
	get,
	getOneById,
	createOne,
	deleteOneById,
	check
}
export default TriggersService
