import getGuild from "../get-guild.js"

const createChannel = async (
	guild,
	{
		name,
		type,
		topic,
		nsfw,
		parent,
		permissionOverwrites
	}
) => {
	const options = {
		name,
		type,
		permissionOverwrites
	}

	if (topic) {
		options.topic = topic
	}
	if (nsfw) {
		options.nsfw = nsfw
	}
	if (parent) {
		options.parent = parent
	}

	const channel = await guild.channels.create(options)
	return channel
}

const deleteChannel = async (guild, channelId) => {
	if (!guild.channels.cache.has(channelId)) {
		return
	}
	return guild.channels.delete(channelId)
}
const getChannel = async (channelId) => {
	const guild = getGuild()
	return guild.channels.cache.get(channelId)
}

export {
	createChannel,
	deleteChannel,
	getChannel
}
