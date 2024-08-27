import { ChannelType, PermissionFlagsBits } from "discord.js"
import ClanesConfig from "../../config/clanes.config.js"
import config from "../../config/config.js"

export const getTextChannelOptions = async ({ clanName, roleId, everyoneRoleId }) => {
	const clanesConfig = await ClanesConfig.get()
	const parent = clanesConfig.text_parent_id || undefined

	return {
		name: clanName,
		type: ChannelType.GuildText,
		topic: `Canal de texto para el clan ${clanName}`,
		nsfw: false,
		parent,
		permissionOverwrites: [
			{
				id: everyoneRoleId,
				deny: [
					PermissionFlagsBits.ViewChannel
				]
			},
			{
				id: roleId,
				allow: [
					PermissionFlagsBits.ViewChannel,
					PermissionFlagsBits.SendMessages,
					PermissionFlagsBits.AttachFiles,
					PermissionFlagsBits.AddReactions,
					PermissionFlagsBits.UseExternalEmojis,
					PermissionFlagsBits.MentionEveryone,
					PermissionFlagsBits.ReadMessageHistory
				]
			},
			{
				id: config.client_id,
				allow: [
					PermissionFlagsBits.ViewChannel,
					PermissionFlagsBits.ManageChannels
				]
			}
		]
	}
}
export const getVoiceChannelOptions = async ({ clanName, roleId, everyoneRoleId }) => {
	const clanesConfig = await ClanesConfig.get()
	const parent = clanesConfig.voice_parent_id || undefined

	return {
		name: clanName,
		type: ChannelType.GuildVoice,
		parent,
		permissionOverwrites: [
			{
				id: everyoneRoleId,
				allow: [
					PermissionFlagsBits.ViewChannel
				],
				deny: [
					PermissionFlagsBits.Connect
				]
			},
			{
				id: roleId,
				allow: [
					PermissionFlagsBits.ViewChannel,
					PermissionFlagsBits.Connect,
					PermissionFlagsBits.Speak,
					PermissionFlagsBits.Stream
				]
			},
			{
				id: config.client_id,
				allow: [
					PermissionFlagsBits.Connect,
					PermissionFlagsBits.ViewChannel,
					PermissionFlagsBits.ManageChannels
				]
			}
		]
	}
}
