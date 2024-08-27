import fs from "node:fs/promises"
import logger from "../lib/logger/logger.js"
import FILE_EXTENSIONS from "../enums/files.js"

const fileExists = async (_path) => {
	try {
		await fs.access(_path, fs.constants.F_OK)
		return true
	} catch {
		return false
	}
}

const mkdir = async (_path, recursive) => {
	try {
		if (recursive) {
			await fs.mkdir(_path, { recursive: true })
		} else {
			await fs.mkdir(_path)
		}
		logger.info(`Created folder ${_path}`)
	} catch (error) {
		logger.error(`Error creating folder: ${_path}`)
		logger.error(error)
	}
}

const writeFile = async (_path, data) => {
	try {
		if (data instanceof Object) {
			data = JSON.stringify(data, null, 2)
		}
		await fs.writeFile(_path, data)
		logger.info(`File written to ${_path}`)
	} catch (error) {
		logger.error(`Error writing file to ${_path}`)
		logger.error(error)
	}
}

const readFile = async (_path, extension) => {
	try {
		const data = await fs.readFile(_path, { encoding: "utf8" })
		if (extension === FILE_EXTENSIONS.json) {
			return JSON.parse(data)
		}
		return data
	} catch (error) {
		logger.error(`Error reading file from ${_path}`)
		logger.error(error)
	}
}

const FilesHelper = {
	fileExists,
	mkdir,
	writeFile,
	readFile
}

export default FilesHelper
