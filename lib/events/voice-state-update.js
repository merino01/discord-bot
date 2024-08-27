import LogsConfig from "../../config/logs.config.js"
import { COLORS } from "../../enums/colors.js"
import { getChannel } from "../../utils/discord-api/channels.js"
import { createEmbed } from "../../utils/discord-api/components.js"
import logger from "../logger/logger.js"

// eslint-disable-next-line complexity
const VoiceStateUpdateHanlder = async (client, oldState, newState) => {
	const logsConfig = await LogsConfig.get()
	const logsEnabled =
		logsConfig.voicelog?.enabled &&
		logsConfig.voicelog?.channel !== ""

	if (!logsEnabled) {
		return
	}

	if (oldState.channelId === null && newState.channelId !== null) {
		client.emit("voiceChannelJoin", newState)
	} else if (oldState.channelId !== null && newState.channelId === null) {
		client.emit("voiceChannelLeave", oldState)
	} else if (oldState.channelId !== null && newState.channelId !== null) {
		if (oldState.channelId !== newState.channelId) {
			client.emit("voiceChannelSwitch", oldState, newState)
		} else {
			stateUpdated(oldState, newState)
		}
	}
}

export default VoiceStateUpdateHanlder

// eslint-disable-next-line complexity
async function stateUpdated (oldState, newState) {
	const logsConfig = await LogsConfig.get()
	const { guild } = oldState
	const sendChannel = await getChannel(guild, logsConfig.voicelog.channel)
	if (!sendChannel) {
		return
	}

	const embedOptions = {
		title: "",
		description: `<@${newState.member.id}> - ${newState.member.user.tag}`,
		color: COLORS.yellow,
		timestamp: new Date().toISOString()
	}
	let logMsg = ""
	if (oldState.serverDeaf !== newState.serverDeaf) {
		// User server deafened
	} else if (oldState.serverMute !== newState.serverMute) {
		// User server muted
	} else if (oldState.selfDeaf !== newState.selfDeaf) {
		// User self deafened
		if (newState.selfDeaf) {
			embedOptions.title = "Un usuario se ha silenciado"
			logMsg = `User deafen: '${newState.member.user.tag} (${newState.member.id})'`
		} else {
			embedOptions.title = "Un usuario se ha des-silenciado"
			logMsg = `User undeafen: '${newState.member.user.tag} (${newState.member.id})'`
		}
	} else if (oldState.selfMute !== newState.selfMute) {
		// User self muted
		if (newState.selfMute) {
			embedOptions.title = "Un usuario se ha silenciado"
			logMsg = `User muted: '${newState.member.user.tag} (${newState.member.id})'`
		} else {
			embedOptions.title = "Un usuario se ha des-silenciado"
			logMsg = `User unmuted: '${newState.member.user.tag} (${newState.member.id})'`
		}
	} else if (oldState.selfVideo !== newState.selfVideo) {
		// User self video
		if (newState.selfVideo) {
			embedOptions.title = "Un usuario ha activado la cámara"
			logMsg = `User video enabled: '${newState.member.user.tag} (${newState.member.id})'`
		} else {
			embedOptions.title = "Un usuario ha desactivado la cámara"
			logMsg = `User video disabled: '${newState.member.user.tag} (${newState.member.id})'`
		}
	} else if (oldState.streaming !== newState.streaming) {
		// User streaming
		if (newState.streaming) {
			embedOptions.title = "Un usuario a comenzado una retransmisión"
			logMsg = `User started streaming: '${newState.member.user.tag} (${newState.member.id})'`
		} else {
			embedOptions.title = "Un usuario a dejado de retransmitir"
			logMsg = `User stopped streaming: '${newState.member.user.tag} (${newState.member.id})'`
		}
	}
	sendChannel.send({ embeds: [createEmbed(embedOptions)] })
	logger.info(logMsg)
}
