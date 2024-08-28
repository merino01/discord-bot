import logger from "../logger/logger.js"
import config from "../../config/config.js"
import loop from "../loop/loop.js"
import sendMessageToAdmin from "../../utils/send-message-to-admin.js"
import { setGuild } from "../../utils/get-guild.js"

const { guild_id } = config

const Ready = async (client) => {
	const guild = client.guilds.cache.get(guild_id)
	if (!guild) {
		logger.error("Guild not found")
		return
	}

	setGuild(guild)

	try {
		await guild.members.fetch()
		await loop.start(client)
		sendMessageToAdmin("🟥🟧🟨🟩 **Ready** 🟩🟨🟧🟥", client)
	} catch (error) {
		logger.error(error)
	}

	logger.info(`Bot ready for guild '${guild.name}' (${guild.memberCount} members)`)
	logger.info(`Logged in as "${client.user.tag}"`)
}

export default Ready
