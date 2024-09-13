import AutomaticMessagesService from "../../services/auto-messages.service.js"

const autoMessages = new Map()

export async function setCreatingAutoMessage (id, data) {
	if (
		data.title &&
		data.message &&
		data.categoryId
	) {
		try {
			await AutomaticMessagesService.insertOne({ ...data, id })
		} finally {
			autoMessages.delete(id)
		}
	} else {
		autoMessages.set(id, data)
	}
}

export function getCreatingAutoMessage (id) {
	const autoMsg = autoMessages.get(id) || {}
	return autoMsg
}
