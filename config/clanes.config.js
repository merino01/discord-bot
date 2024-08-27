import FILE_EXTENSIONS from "../enums/files.js"
import PathsHelper from "../helpers/paths-helper.js"
import FilesHelper from "../helpers/files-helper.js"

const { CLANES_CONFIG_PATH } = PathsHelper
const { fileExists, writeFile, readFile } = FilesHelper

const get = async () => {
	const basicConfig = {
		text_parent_id: "",
		voice_parent_id: "",
		additional_roles: [],
		lider_roles: [],
		archive: false,
		archived_parent_id: ""
	}
	if (! await fileExists(CLANES_CONFIG_PATH)) {
		return basicConfig
	}

	const c = await readFile(CLANES_CONFIG_PATH, FILE_EXTENSIONS.json)
	return { ...basicConfig, ...c }
}

const set = async (newConfig) => {
	await writeFile(CLANES_CONFIG_PATH, newConfig)
}

const ClanesConfig = { get, set }
export default ClanesConfig
