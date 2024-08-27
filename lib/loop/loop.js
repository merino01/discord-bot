import config from "../../config/config.js"
import PendingMessagesService from "../../services/pending-messages.service.js"
import { ONE_SECOND } from "../../utils/time.js"
import logger from "../logger/logger.js"

const LOOP_INTERVAL = ONE_SECOND

let guild = null
const start = async (client) => {
	guild = client.guilds.cache.get(config.guild_id)

	logger.info("Loop started")
	try {
		deletePendingMessages()
		setInterval(deletePendingMessages, LOOP_INTERVAL)
	} catch (error) {
		logger.error("Loop failed")
		logger.error(error)
	}
}

async function deletePendingMessages () {
	const messages = await PendingMessagesService.findAll()
	if (!messages.length) { return }

	for (const message of messages) {
		try {
			const { channel_id, message_id } = message
			const channel = guild.channels.cache.get(channel_id)
			const msg = await channel?.messages.fetch(message_id)

			if (!msg && !channel_id) {
				continue
			}

			PendingMessagesService.deleteOneByMessageId(message_id)
			await msg.delete()
		} catch {
			PendingMessagesService.deleteOneById(message.id)
		}
	}
}

const loop = { start }
export default loop
