import { SlashCommandSubcommandBuilder } from "discord.js"
import ClanesService from "../../../../services/clanes.service.js"
import { addRoleToUser } from "../../../../utils/discord-api/roles.js"
import ClanesConfig from "../../../../config/clanes.config.js"
import logClanCommandToChannel from "../../../../utils/clanes/log-to-channel.js"
import { COLORS } from "../../../../enums/colors.js"
import isLider from "../../../../utils/clanes/is-lider.js"

export default {
	defer: true,
	ephemeral: true,
	data: new SlashCommandSubcommandBuilder()
		.setName("addlider")
		.setDescription("Agrega un nuevo líder al clan")
		.addUserOption((option) => option
			.setName("lider")
			.setDescription("Nuevo líder")
			.setRequired(true)
		),
	execute: async (interaction) => {
		const { guild } = interaction
		const target = interaction.options.getUser("lider")
		const targetMember = guild.members.cache.get(target.id)
		const author = interaction.member

		const clan = await ClanesService.getMemberClan(author)
		if (!clan) {
			return {
				content: "❗No perteneces a ningún clan"
			}
		}

		if (! await isLider(author, clan)) {
			return {
				content: "❌ Solo los líderes pueden usar este comando"
			}
		}

		const isTargetInSameClan = await targetMember.roles.cache.has(clan.roleId)
		if (!isTargetInSameClan) {
			return {
				content: "❌ El usuario no pertenece al mismo clan"
			}
		}

		const clanesConfig = await ClanesConfig.get()
		const { lider_roles } = clanesConfig
		for (const role of lider_roles) {
			await addRoleToUser(targetMember, role)
		}

		clan.liders.push(target.id)
		await ClanesService.updateOne(clan)

		logClanCommandToChannel({
			userId: author.id,
			command: "/clan addlider",
			fields: [
				{ name: "Nuevo líder", value: `<@${target.id}>` },
				{ name: "Clan", value: `<@&${clan.roleId}>` }
			],
			color: COLORS.green
		})
		return {
			content: "✅ Líder añadido correctamente"
		}
	}
}
