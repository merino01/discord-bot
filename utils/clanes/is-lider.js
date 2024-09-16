import ClanesConfig from "../../config/clanes.config.js"

export default async function (user, clan) {
	const config = await ClanesConfig.get()
	const { lider_roles } = config
	return clan.liders.includes(user.id) || lider_roles.some((role) => user.roles.cache.has(role))
}
