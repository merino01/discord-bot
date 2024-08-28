import FILE_EXTENSIONS from "../enums/files.js"
import FilesHelper from "../helpers/files-helper.js"
import PathsHelper from "../helpers/paths-helper.js"

const { LOGS_CONFIG_PATH } = PathsHelper
const { fileExists, writeFile, readFile } = FilesHelper

const get = async () => {
	const basicConfig = {
		chatlog: {
			enabled: false,
			channel: ""
		},
		voicelog: {
			enabled: false,
			channel: ""
		},
		claneslog: {
			enabled: false,
			channel: ""
		},
		commandlog: {
			enabled: false,
			channel: ""
		}
	}

	if (! await fileExists(LOGS_CONFIG_PATH)) {
		return basicConfig
	}

	const c = await readFile(LOGS_CONFIG_PATH, FILE_EXTENSIONS.json)
	return { ...basicConfig, ...c }
}

const set = async (newConfig) => {
	await writeFile(LOGS_CONFIG_PATH, newConfig)
}

const LogsConfig = { get, set }
export default LogsConfig
