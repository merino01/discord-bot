import { GET_MANY, GET_ONE, RUN } from "../lib/database/database.js"

const findAll = async () => {
	const autoMsg = await GET_MANY({
		query: "SELECT * FROM channel_auto_messages"
	})
	return autoMsg
}

const findOneById = async (id) => {
	const autoMsg = await GET_ONE({
		query: "SELECT * FROM channel_auto_messages WHERE id = ?",
		params: [id]
	})
	return autoMsg
}

const findOneByCategory = async (categoryId) => {
	const autoMsg = await GET_ONE({
		query: "SELECT * FROM channel_auto_messages WHERE categoryId = ?",
		params: [categoryId]
	})
	return autoMsg
}

const insertOne = async (data) => {
	const { id, title, message, categoryId, timeout, color } = data
	await RUN({
		query: `
			INSERT INTO channel_auto_messages (
				id,
				title,
				message,
				categoryId,
				timeout,
				color
			) VALUES (?, ?, ?, ?, ?, ?)
		`,
		params: [id, title, message, categoryId, timeout, color]
	})
}

const deleteOneById = async (id) => await RUN({
	query: "DELETE FROM channel_auto_messages WHERE id = ?",
	params: [id]
})

const AutomaticMessagesService = {
	findAll,
	findOneById,
	findOneByCategory,
	insertOne,
	deleteOneById
}

export default AutomaticMessagesService
