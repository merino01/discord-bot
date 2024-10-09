import api from "../lib/api.js"

const get = async () => api.GET("automatic-messages")
const findOneById = async (id) => api.GET(`automatic-messages/${id}`)
const findOneByCategory = async (categoryId) => {
	const automaticMessages = await api.GET(`automatic-messages/category/${categoryId}`)
	if (Array.isArray(automaticMessages) && automaticMessages.length > 0) {
		return automaticMessages[0]
	}
	return null
}

const createOne = async (data) => {
	const { title, message, categoryId, timeout, color } = data
	return await api.POST("automatic-messages", {
		title,
		message,
		category: categoryId,
		timeout,
		color
	})
}

const deleteOneById = async (id) => api.DELETE(`automatic-messages/${id}`)

const AutomaticMessagesService = {
	get,
	createOne,
	findOneById,
	findOneByCategory,
	deleteOneById
}

export default AutomaticMessagesService
