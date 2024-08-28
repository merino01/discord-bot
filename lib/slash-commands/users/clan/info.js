import { SlashCommandSubcommandBuilder } from "discord.js"
import ClanesService from "../../../../services/clanes.service.js"
import getClanInfo from "../../../../utils/clanes/get-clan-info.js"
import logClanCommandToChannel from "../../../../utils/clanes/log-to-channel.js"
import { COLORS } from "../../../../enums/colors.js"

export default {
	defer: true,
	ephemeral: true,
	data: new SlashCommandSubcommandBuilder()
		.setName("info")
		.setDescription("Muestra la información del clan"),
	execute: async (interaction) => {
		const author = interaction.member

		const clan = await ClanesService.getMemberClan(author)
		if (!clan) {
			return {
				content: "❗No perteneces a ningún clan"
			}
		}

		const info = await getClanInfo({ clan })

		logClanCommandToChannel({
			userId: author.id,
			command: "/clan info",
			fields: [
				{ name: "Clan", value: `<@&${clan.roleId}>` }
			],
			color: COLORS.blue
		})
		return info
	}
}
