import PathsHelper from "../helpers/paths-helper.js"
import FilesHelper from "../helpers/files-helper.js"
import FILE_EXTENSIONS from "../enums/files.js"

const {
	CONFIG_PATH
} = PathsHelper
const { fileExists, writeFile, readFile } = FilesHelper

await PathsHelper.createRequiredFolders()

const configJson = await loadConfigFile()

const config = {
	token: configJson.token,
	prefix: configJson.prefix,
	admin_id: configJson.admin_id,
	guild_id: configJson.guild_id,
	client_id: configJson.client_id,
	moderator_role_id: configJson.moderator_role_id
}

saveConfig(config)

export default config

export async function saveConfig (newConfig) {
	for (const key in newConfig) {
		config[key] = newConfig[key]
	}

	await writeFile(CONFIG_PATH, config)
}

async function loadConfigFile () {
	if (await fileExists(CONFIG_PATH)) {
		return readFile(CONFIG_PATH, FILE_EXTENSIONS.json)
	} else {
		throw new Error("Config file not found")
	}
}

