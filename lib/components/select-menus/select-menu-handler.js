import handleTriggersSelectMenus from "./triggers-select-menus.js"
import handleMessagesFormatsSelectMenus from "./messages-formats-select-menus.js"
import { handleChannelAutoMsgSelectMenus } from "./channels-auto-messages-select-menus.js"
import { BUTTON_LABELS } from "../../../enums/interactions.js"
import handleLogsSelectMenus from "./logs-select-menus.js"

const handlers = {
	[BUTTON_LABELS.PREFIXES.triggers]: handleTriggersSelectMenus,
	[BUTTON_LABELS.PREFIXES.messageFormats]: handleMessagesFormatsSelectMenus,
	[BUTTON_LABELS.PREFIXES.channelAutomaticMessages]: handleChannelAutoMsgSelectMenus,
	[BUTTON_LABELS.PREFIXES.logs]: handleLogsSelectMenus
}

export default async function (interaction, selectMenuId) {
	for (const [prefix, handler] of Object.entries(handlers)) {
		if (selectMenuId.startsWith(prefix)) {
			return await handler(interaction, selectMenuId)
		}
	}
}

