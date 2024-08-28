import { SlashCommandSubcommandBuilder } from "discord.js"
import logger from "../../../logger/logger.js"
import ClanesService from "../../../../services/clanes.service.js"
import { createChannel } from "../../../../utils/discord-api/channels.js"
import { getVoiceChannelOptions } from "../../../../utils/clanes/get-channels-permissions.js"
import getAllClanesButtons from "../../../../utils/clanes/get-all-clanes-buttons.js"
import { BUTTON_LABELS } from "../../../../enums/interactions.js"
import logClanCommandToChannel from "../../../../utils/clanes/log-to-channel.js"
import { COLORS } from "../../../../enums/colors.js"

const AddVoiceChannelCommand = {
	data: new SlashCommandSubcommandBuilder()
		.setName("addvoicechannel")
		.setDescription("Añade un canal de voz adicional a un clan"),

	execute: async () => {
		try {
			return await getAllClanesButtons(BUTTON_LABELS.CLANES.addVoiceChannel)
		} catch (error) {
			logger.error("Error adding additional role")
			logger.error(error)
			return {
				content: "❌ Error al añadir el rol adicional"
			}
		}
	}
}

export default AddVoiceChannelCommand

export async function addVoiceChannelToClan (interaction, clanId) {
	const clan = await ClanesService.findOneById(clanId)
	if (!clan) {
		return {
			content: `❌ No se ha encontrado el clan \`${clanId}\``
		}
	}

	const channelOptions = await getVoiceChannelOptions({
		clanName: clan.name,
		roleId: clan.roleId,
		everyoneRoleId: interaction.guild.roles.everyone.id
	})
	channelOptions.name = `${channelOptions.name} #${clan.voiceChannelIds.length + 1}`

	const newChannel = await createChannel(interaction.guild, channelOptions)

	clan.voiceChannelIds.push(newChannel.id)
	await ClanesService.updateOne(clan)

	logClanCommandToChannel({
		userId: interaction.member.id,
		command: "/admin clanes addvoicechannel",
		fields: [
			{ name: "Clan", value: `<@&${clan.roleId}>` },
			{ name: "Canal", value: `<#${newChannel.id}>` }
		],
		color: COLORS.green
	})
	return {
		content: `✅ Canal añadido al clan ${clan.name}`
	}
}
