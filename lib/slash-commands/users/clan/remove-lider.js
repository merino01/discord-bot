import { SlashCommandSubcommandBuilder } from "discord.js"
import ClanesService from "../../../../services/clanes.service.js"
import { removeRoleFromUser } from "../../../../utils/discord-api/roles.js"
import { COLORS } from "../../../../enums/colors.js"
import ClanesConfig from "../../../../config/clanes.config.js"

const RemoveLiderCommand = {
	liderOnly: true,
	log: true,
	logColor: COLORS.yellow,
	command: new SlashCommandSubcommandBuilder()
		.setName("removelider")
		.setDescription("Elimina un líder del clan")
		.addUserOption((option) => option
			.setName("lider")
			.setDescription("líder para quitar")
			.setRequired(true)
		),
	execute: async (interaction) => {
		const { guild } = interaction
		const target = interaction.options.getUser("lider")
		const targetMember = guild.members.cache.get(target.id)
		const author = interaction.member

		const clan = await ClanesService.getMemberClan(author)
		if (!clan) {
			return await interaction.reply({
				content: "❗No perteneces a ningún clan",
				ephemeral: true
			})
		}

		const isTargetInSameClan = await targetMember.roles.cache.has(clan.roleId)
		if (!isTargetInSameClan) {
			return await interaction.reply({
				content: "❌ El usuario no pertenece al mismo clan",
				ephemeral: true
			})
		}

		const clanesConfig = await ClanesConfig.get()
		const { lider_roles } = clanesConfig
		for (const role of lider_roles) {
			await removeRoleFromUser(targetMember, role)
		}

		clan.liders.splice(
			clan.liders.indexOf(target.id),
			1
		)
		await ClanesService.updateOne(clan)

		return await interaction.reply({
			content: "✅ Líder eliminado correctamente",
			ephemeral: true
		})
	}
}

export default RemoveLiderCommand
