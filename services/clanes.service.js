import logger from "../lib/logger/logger.js"
import { GET_MANY, GET_ONE, RUN } from "../lib/database/database.js"
import ClanesConfig from "../config/clanes.config.js"

// eslint-disable-next-line complexity
const clanDbToClan = (clan) => {
	if (!clan) { return null }
	clan.liders = (clan.liders?.split(",") || []).filter(Boolean)
	clan.textChannelIds = clan.textChannelIds?.split(",") || []
	clan.voiceChannelIds = clan.voiceChannelIds?.split(",") || []
	clan.lider_roles = clan.lider_roles?.split(",") || []
	clan.additional_roles = clan.additional_roles?.split(",") || []
	clan.created_at = new Date(clan.created_at)
	clan.deleted_at = clan.deleted_at ? new Date(clan.deleted_at) : null
	clan.archived_at = clan.archived_at ? new Date(clan.archived_at) : null
	clan.members = clan.members?.split(",") || []
	return clan
}

const findAll = async () => {
	try {
		const clanes = await GET_MANY({
			query: `
        SELECT * FROM clanes
        WHERE
          (deleted IS NULL or deleted = 0)
					AND (archived IS NULL or archived = 0)
        ORDER BY created_at DESC
      `
		})
		if (!clanes || clanes.length < 1) { return [] }
		return clanes.map(clanDbToClan)
	} catch (error) {
		logger.error("Error on getting clanes")
		logger.error(error)
	}
}

const findAllDeleted = async () => {
	try {
		const clanes = await GET_MANY({
			query: `
        SELECT * FROM clanes
        WHERE
          deleted = 1 or archived = 1
        ORDER BY deleted_at DESC
      `
		})
		if (!clanes || clanes.length < 1) { return [] }
		return clanes.map(clanDbToClan)
	} catch (error) {
		logger.error("Error on getting deleted clanes")
		logger.error(error)
	}
}

const findOneById = async (clanId) => {
	const clan = await GET_ONE({
		query: "SELECT * FROM clanes WHERE id = ?",
		params: [clanId]
	})
	return clanDbToClan(clan)
}

const findOneByName = async (clanName) => {
	const clan = await GET_ONE({
		query: "SELECT * FROM clanes WHERE name like ?",
		params: [`%${clanName}%`]
	})
	return clanDbToClan(clan)
}

const findOneByRole = async (_roleId) => {
	const clan = await GET_ONE({
		query: "SELECT * FROM clanes WHERE roleId = ?",
		params: [_roleId]
	})
	return clanDbToClan(clan)
}

const getMemberClan = async (member) => {
	const clanes = await findAll()
	return clanes.find(({ roleId }) => member.roles.cache.has(roleId))
}

const isMemberLider = async (member) => {
	const clanesConfig = await ClanesConfig.get()
	const { lider_roles } = clanesConfig

	let hasAllRoles = true
	for (const role of lider_roles) {
		if (member.roles.cache.has(role)) {
			continue
		} else {
			hasAllRoles = false
			break
		}
	}
	return hasAllRoles
}

const insertOne = async (clan) => {
	clan.liders = clan.liders.join(",")
	clan.textChannelIds = clan.textChannelIds.join(",")
	clan.voiceChannelIds = clan.voiceChannelIds.join(",")
	clan.lider_roles = clan.lider_roles.join(",")
	clan.additional_roles = clan.additional_roles.join(",")
	clan.created_at = new Date().toISOString()
	await RUN({
		query: `
      INSERT INTO clanes (
        id,
        name,
        liders,
        roleId,
        textChannelIds,
        voiceChannelIds,
        lider_roles,
        additional_roles,
        text_parent_id,
        voice_parent_id,
        created_at,
        members
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
		params: [
			clan.id,
			clan.name,
			clan.liders,
			clan.roleId,
			clan.textChannelIds,
			clan.voiceChannelIds,
			clan.lider_roles,
			clan.additional_roles,
			clan.text_parent_id,
			clan.voice_parent_id,
			clan.created_at,
			clan.liders
		]
	})
}

const deleteOneById = async (clanId) => {
	const clanesConfig = await ClanesConfig.get()
	const { archive } = clanesConfig
	const field1 = archive ? "archived" : "deleted"
	const field2 = archive ? "archived_at" : "deleted_at"
	await RUN({
		query: `
      UPDATE clanes
      SET
        ${field1}       = 1,
        ${field2}       = ?,
        roleId          = NULL,
        liders          = NULL,
        members         = NULL,
        voiceChannelIds = NULL
      WHERE id = ?
    `,
		params: [
			new Date().toISOString(),
			clanId
		]
	})
}

const updateOne = async (clan) => {
	clan.liders = clan.liders.join(",")
	clan.textChannelIds = clan.textChannelIds.join(",")
	clan.voiceChannelIds = clan.voiceChannelIds.join(",")
	clan.lider_roles = clan.lider_roles.join(",")
	clan.additional_roles = clan.additional_roles.join(",")
	clan.members = clan.members.join(",")
	await RUN({
		query: `
      UPDATE clanes SET
        name = ?,
        liders = ?,
        roleId = ?,
        textChannelIds = ?,
        voiceChannelIds = ?,
        lider_roles = ?,
        additional_roles = ?,
        text_parent_id = ?,
        voice_parent_id = ?,
        members = ?
      WHERE id = ?
    `,
		params: [
			clan.name,
			clan.liders,
			clan.roleId,
			clan.textChannelIds,
			clan.voiceChannelIds,
			clan.lider_roles,
			clan.additional_roles,
			clan.text_parent_id,
			clan.voice_parent_id,
			clan.members,
			clan.id
		]
	})
}

const ClanesService = {
	findAll,
	findAllDeleted,
	findOneById,
	findOneByName,
	findOneByRole,
	insertOne,
	deleteOneById,
	updateOne,
	getMemberClan,
	isMemberLider
}

export default ClanesService
