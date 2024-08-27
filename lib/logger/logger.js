import { serializeError } from "../../utils/errors.js"

const logger = {
	info,
	warn,
	error,
	data
}

export default logger

function info (message) {
	log(message, "info")
}
function warn (message) {
	log(message, "warn")
}
function error (message) {
	const content = message instanceof Error
		? JSON.stringify(serializeError(message))
		: message
	log(content, "error")
}
function data (message) {
	const content = JSON.stringify(message)
	log(content, "data")
}

function log (message, type) {
	if (!message.trim()) { return }

	const d = new Date().toISOString()

	try {
		console.log(`${d} [${type.toUpperCase()}] # ${message}`)
	} catch (err) {
		logger.error(err)
	}
}
