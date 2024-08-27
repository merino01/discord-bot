import { GET_MANY, RUN } from "../lib/database/database.js"

const findAll = async () => {
	const messages = await GET_MANY({
		query: "SELECT * FROM pending_messages WHERE datetime('now') > datetime(delete_at)"
	})
	return messages
}

const insertOne = async (message) => {
	const { channel_id, message_id, delete_at } = message

	await RUN({
		query: `
			INSERT INTO pending_messages
				(channel_id, message_id, delete_at)
			VALUES
				(?, ?, ?)
		`,
		params: [channel_id, message_id, delete_at]
	})
}

const deleteOneById = async (id) => {
	await RUN({
		query: "DELETE FROM pending_messages WHERE id = ?",
		params: [id]
	})
}

const deleteOneByMessageId = async (messageId) => {
	await RUN({
		query: "DELETE FROM pending_messages WHERE message_id = ?",
		params: [messageId]
	})
}

const PendingMessagesService = {
	findAll,
	insertOne,
	deleteOneById,
	deleteOneByMessageId
}
export default PendingMessagesService
