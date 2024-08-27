const createRole = async (guild, roleData) => await guild.roles.create(roleData)
const addRoleToUser = async (user, role) => {
	if (user.roles.cache.has(role.id)) {
		return
	}
	return await user.roles.add(role)
}
const removeRoleFromUser = async (user, role) => {
	if (!user.roles.cache.has(role)) {
		return
	}
	return await user.roles.remove(role)
}
const deleteRole = async (guild, roleId) => {
	if (!guild.roles.cache.has(roleId)) {
		return
	}
	return await guild.roles.delete(roleId)
}
const getRole = async (guild, roleId) => await guild.roles.fetch(roleId)

export { createRole, addRoleToUser, deleteRole, getRole, removeRoleFromUser }
