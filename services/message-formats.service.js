import { GET_MANY, GET_ONE, RUN } from "../lib/database/database.js"

const findAll = async () => {
	const formats = await GET_MANY({
		query: "SELECT * FROM message_formats"
	})
	return formats
}

const findOneById = async (id) => {
	const format = await GET_ONE({
		query: "SELECT * FROM message_formats WHERE id = ?",
		params: [id]
	})
	return format
}

const findOneByChannel = async (channelId) => {
	const format = await GET_ONE({
		query: "SELECT * FROM message_formats WHERE channelId = ?",
		params: [channelId]
	})
	return format
}

const insertOne = async (data) => {
	const { name, description, channelId, regex, regex_flags, id, timeout } = data
	await RUN({
		query: `
			INSERT INTO message_formats (
				id,
				name,
				description,
				channelId,
				regex,
				regex_flags,
				timeout
			) VALUES (?, ?, ?, ?, ?, ?, ?)
		`,
		params: [id, name, description, channelId, regex, regex_flags, timeout]
	})
}

const deleteOneById = async (id) => {
	await RUN({
		query: "DELETE FROM message_formats WHERE id = ?",
		params: [id]
	})
}

const MessageFormatsService = {
	findAll,
	findOneById,
	findOneByChannel,
	insertOne,
	deleteOneById
}

export default MessageFormatsService
