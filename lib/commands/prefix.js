import config, { saveConfig } from "../../config/config.js"

const { prefix } = config

const Prefix = {
	name: "prefix",
	description: "Cambia el prefijo del bot",
	roles: [config.moderator_role_id],
	execute: async (message, [newPrefix]) => {
		if (!newPrefix) {
			message.reply({ content: `El prefijo es ${prefix}` })
			return
		}

		await saveConfig({ prefix: newPrefix })
		message.reply({ content: `Prefijo cambiado a ${newPrefix}` })
	}
}

export default Prefix
