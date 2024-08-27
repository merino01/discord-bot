import { COLORS } from "../../../enums/colors.js"
import { getChannel } from "../../../utils/discord-api/channels.js"
import logger from "../../logger/logger.js"
import { createEmbed } from "../../../utils/discord-api/components.js"
import LogsConfig from "../../../config/logs.config.js"

const VoiceChannelJoin = async (_, voiceState) => {
	logger.info("Event received: 'VoiceChannelJoin'")

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
			title: "Usuario unido a canal de voz",
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
			color: COLORS.green
		})

		sendChannel.send({ embeds: [embed] })
		logger.info(
			`User '${member.user.tag} (${member.id})' joined voice channel '${channel.name}'`
		)
	} catch (error) {
		logger.error("error in voiceChannelJoin event")
		logger.error(error)
	}
}

export default VoiceChannelJoin
