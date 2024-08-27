import path from "node:path"
import { fileURLToPath } from "node:url"
import FilesHelper from "./files-helper.js"

const { fileExists, mkdir } = FilesHelper

const filename = (metaURL) => fileURLToPath(metaURL)
const dirname = (metaURL) => path.dirname(filename(metaURL))

const _dirname = dirname(import.meta.url)

const ROOT = path.join(_dirname, "..")

const CONFIG_PATH = path.join(ROOT, "config.json")
const SETTINGS_PATH = path.join(ROOT, "settings")
const LOGS_PATH = path.join(ROOT, "logs")

const CLANES_CONFIG_PATH = path.join(SETTINGS_PATH, "clanes.json")
const LOGS_CONFIG_PATH = path.join(SETTINGS_PATH, "logs.json")
const DATABASE_PATH = path.join(ROOT, "lib", "database", "database.db")

const REQUIRED_PATHS = [
	SETTINGS_PATH,
	LOGS_PATH
]

const createRequiredFolders = async () => {
	for (const folder of REQUIRED_PATHS) {
		if (!await fileExists(folder)) {
			await mkdir(folder, true)
		}
	}
}

const PathsHelper = {
	filename,
	dirname,
	createRequiredFolders,
	CONFIG_PATH,
	CLANES_CONFIG_PATH,
	LOGS_CONFIG_PATH,
	DATABASE_PATH
}

export default PathsHelper
