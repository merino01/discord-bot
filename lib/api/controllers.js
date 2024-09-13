import AutomaticMessagesService from "../../services/auto-messages.service.js"
import logger from "../logger/logger.js"

export async function getAutomaticMessages (req, res) {
	try {
		const messages = await AutomaticMessagesService.findAll()
		return res.status(200).json(messages)
	} catch (error) {
		logger.error(error)
		return res.status(500).json({ success: false, error: "Internal server error" })
	}
}

export async function createAutomaticMessage (req, res) {
	const { body } = req

	try {
		await AutomaticMessagesService.insertOne(body)
		return res.status(200).json({ success: true })
	} catch (error) {
		logger.error(error)
		return res.status(500).json({ success: false, error: "Internal server error" })
	}
}

export async function deleteAutomaticMessage (req, res) {
	const { id } = req.params

	try {
		await AutomaticMessagesService.deleteOneById(id)
		return res.status(200).json({ success: true })
	} catch (error) {
		logger.error(error)
		return res.status(500).json({ success: false, error: "Internal server error" })
	}
}
