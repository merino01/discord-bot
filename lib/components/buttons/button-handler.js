import { BUTTON_LABELS } from "../../../enums/interactions.js"
import { handleChannelAutoMsgButtons } from "./channel-auto-messages-buttons.js"
import { handleClanButtons } from "./clan-buttons.js"
import { handleLogsButtons } from "./logs-buttons.js"
import { handleMessageFormatsButtons } from "./message-formats-buttons.js"
import { handleTriggerButtons } from "./triggers-buttons.js"

const buttonHandlers = {
	[BUTTON_LABELS.PREFIXES.clanes]: handleClanButtons,
	[BUTTON_LABELS.PREFIXES.triggers]: handleTriggerButtons,
	[BUTTON_LABELS.PREFIXES.messageFormats]: handleMessageFormatsButtons,
	[BUTTON_LABELS.PREFIXES.channelAutomaticMessages]: handleChannelAutoMsgButtons,
	[BUTTON_LABELS.PREFIXES.logs]: handleLogsButtons
}

export default async function (interaction, buttonId) {
	for (const [prefix, handler] of Object.entries(buttonHandlers)) {
		if (buttonId.startsWith(prefix)) {
			return await handler(interaction, buttonId)
		}
	}
}

