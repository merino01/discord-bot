import LogsConfig from "../../../config/logs.config.js"
import { COLORS } from "../../../enums/colors.js"
import { getChannel } from "../../../utils/discord-api/channels.js"
import { createEmbed } from "../../../utils/discord-api/components.js"
import logger from "../../logger/logger.js"

const VoiceChannelLeave = async (_, voiceState) => {
	logger.info("Event received: 'VoiceChannelLeave'")

	const { channel, member, guild } = voiceState

	try {
		const logsConfig = await LogsConfig.get()
		if (!logsConfig.voicelog.enabled || !logsConfig.voicelog.channel) {
			return
		}
		const sendChannel = await getChannel(guild, logsConfig.voicelog.channel)
		if (!sendChannel) {
			return
		}

		const date = new Date().toISOString()
		const embed = createEmbed({
			title: "Usuario salido de canal de voz",
			fields: [
				{
					name: "Usuario",
					value: `<@${member.id}> - ${member.user.tag}`,
					inline: true
				},
				{
					name: "Canal",
					value: `<#${channel.id}> - ${channel.name}`,
					inline: true
				}
			],
			timestamp: date,
			color: COLORS.red
		})

		sendChannel.send({ embeds: [embed] })
		logger.info(`User '${member.user.tag} (${member.id})' left voice channel '${channel.name}'`)
	} catch (error) {
		logger.error("error in voiceChannelLeave event")
		logger.error(error)
	}
}

export default VoiceChannelLeave
