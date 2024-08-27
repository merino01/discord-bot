import LogsConfig from "../../../config/logs.config.js"
import { COLORS } from "../../../enums/colors.js"
import { getChannel } from "../../../utils/discord-api/channels.js"
import { createEmbed } from "../../../utils/discord-api/components.js"
import logger from "../../logger/logger.js"

const VoiceChannelSwitch = async (_, oldState, newState) => {
	logger.info("Event received: 'VoiceChannelSwitch'")

	const { channel: oldChannel } = oldState
	const { channel: newChannel, member, guild } = newState

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
			title: "Usuario movido de canal de voz",
			fields: [
				{
					name: "Usuario",
					value: `<@${member.id}> - ${member.user.tag}`,
					inline: true
				},
				{
					name: "Canal antiguo",
					value: `<#${oldChannel.id}> - ${oldChannel.name}`,
					inline: true
				},
				{
					name: "Canal nuevo",
					value: `<#${newChannel.id}> - ${newChannel.name}`,
					inline: true
				}
			],
			timestamp: date,
			color: COLORS.blue
		})

		sendChannel.send({ embeds: [embed] })
		logger.info(
			`User '${member.user.tag} (${member.id})' switched voice ` +
			`channel '${oldChannel.name}' - '${newChannel.name}'`
		)
	} catch (error) {
		logger.error("error in voiceChannelSwitch event")
		logger.error(error)
	}
}

export default VoiceChannelSwitch
