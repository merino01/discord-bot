import { BUTTON_LABELS } from "../../../enums/interactions.js"
import handleAutoMessagesModals from "./channel-auto-messages-modals.js"
import handleMessagesFormatsModals from "./messages-formats.js"
import handleTriggersModals from "./triggers-modals.js"

const buttonHandlers = {
	[BUTTON_LABELS.PREFIXES.triggers]: handleTriggersModals,
	[BUTTON_LABELS.PREFIXES.messageFormats]: handleMessagesFormatsModals,
	[BUTTON_LABELS.PREFIXES.channelAutomaticMessages]: handleAutoMessagesModals
}

export default async function (interaction, modalId) {
	for (const [prefix, handler] of Object.entries(buttonHandlers)) {
		if (modalId.startsWith(prefix)) {
			return await handler(interaction, modalId)
		}
	}
}
