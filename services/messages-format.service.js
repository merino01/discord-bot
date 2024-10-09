import api from "../lib/api.js"

const url = "messages-format/"

const get = async () => api.GET(url)
const getOneById = async (id) => api.GET(url + id)

const findOneByChannel = async (channelId) => {
	const messagesFormat = await api.GET(url + `channel/${channelId}`)
	if (Array.isArray(messagesFormat) && messagesFormat.length > 0) {
		return messagesFormat[0]
	}
	return null
}

const createOne = async (data) => {
	const { name, description, channelId, regex, regex_flags, timeout } = data
	return await api.POST(url, {
		name,
		description,
		channel: channelId,
		regex,
		regex_flags,
		timeout
	})
}

const deleteOneById = async (id) => api.DELETE(url + id)

const MessagesFormatService = {
	get,
	getOneById,
	findOneByChannel,
	createOne,
	deleteOneById
}

export default MessagesFormatService
