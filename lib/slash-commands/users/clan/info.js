import { SlashCommandSubcommandBuilder } from "discord.js"
import ClanesService from "../../../../services/clanes.service.js"
import getClanInfo from "../../../../utils/clanes/get-clan-info.js"

const InfoCommand = {
	command: new SlashCommandSubcommandBuilder()
		.setName("info")
		.setDescription("Muestra la información del clan"),
	execute: async (interaction) => {
		await interaction.deferReply({ ephemeral: true })

		const author = interaction.member

		const clan = await ClanesService.getMemberClan(author)
		if (!clan) {
			return await interaction.editReply({
				content: "❗No perteneces a ningún clan"
			})
		}

		const info = await getClanInfo({ clan })
		await interaction.editReply(info)
	}
}

export default InfoCommand
