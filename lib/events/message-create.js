import logger from "../logger/logger.js"
import config from "../../config/config.js"
import TriggersService from "../../services/triggers.service.js"
import { addSecondsToDate } from "../../utils/time.js"
import PendingMessagesService from "../../services/pending-messages.service.js"
import { ChannelType } from "discord.js"
import sendMessageToAdmin from "../../utils/send-message-to-admin.js"
import { isMod } from "../../utils/is-mod.js"
import MessagesFormatService from "../../services/messages-format.service.js"

const { prefix, client_id } = config

const MessageCreate = async (client, message) => {
	const { channel, author, content } = message

	if (
		channel.type === ChannelType.DM &&
    author.id !== client_id
	) {
		try {
			return sendMessageToAdmin(
				`El usuario "${author.tag} (${author.id})" ` +
        "ha enviado un mensaje directo al bot\n" +
        `**MENSAJE**\n${content}`
			)
		} catch {
			return
		}
	}

	if (author.bot) { return }
	logger.info("Event received: 'MessageCreate'")

	const channelFormat = await MessagesFormatService.findOneByChannel(channel.id)
	if (channelFormat) {
		checkMessageFormat(message, channelFormat)
	} else {
		TriggersService.check(message)
	}

	if (!content.startsWith(prefix)) { return }
	checkCommand({ client, message })
}

export default MessageCreate

async function checkCommand ({ client, message }) {
	const { content } = message
	const args = content.slice(prefix.length).trim().split(/ +/g)
	const command = args.shift().toLowerCase()

	logger.info("Command received")
	logger.data({
		command,
		args,
		author: {
			user: message.author.tag,
			id: message.author.id
		},
		channel: {
			id: message.channel.id,
			name: message.channel.name
		}
	})

	const cmd = client.commands.get(command)
	if (!cmd) { return }

	if (cmd.permissions) {
		const authorPerms = message.member.permissions
		if (!authorPerms.has(cmd.permissions) && !isMod(message.member)) {
			logger.info("User doesn't have permissions to execute this command")
			message.reply({
				content: "No tienes permisos para ejecutar este comando",
				ephemeral: true
			})
			return
		}
	}

	if (cmd.roles) {
		const authorRoles = message.member.roles.cache
		if (!isMod(message.member) && !cmd.roles.some((role) => authorRoles.has(role))) {
			logger.info("User doesn't have roles to execute this command")
			message.reply({
				content: "No tienes los permisos necesarios para ejecutar este comando",
				ephemeral: true
			})
			return
		}
	}

	try {
		await cmd.execute(message, args)
		logger.info(`Command ${command} executed`)
	} catch (error) {
		logger.error(`Command ${command} failed to execute`)
		logger.error(error)
	}
}

export async function checkMessageFormat (message, channelFormat) {
	const { content, channel } = message

	const { regex: regexStr, regex_flags: flags, timeout } = channelFormat
	if (!regexStr) { return }

	try {
		const regex = new RegExp(regexStr, flags || undefined)
		if (regex.test(content)) {
			if (timeout) {
				setTimeout(() => {
					message.delete()
				}, timeout * 1000)
			}
			return
		}

		message.delete()
	} catch (error) {
		logger.error(error)
	}
	logger.info("Message format doesn't match")
	logger.data({
		message: content,
		channel: {
			id: channel.id,
			name: channel.name
		},
		user: {
			tag: message.author.tag,
			id: message.author.id
		}
	})
}
