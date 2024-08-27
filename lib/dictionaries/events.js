import { Events } from "discord.js"
import Ready from "../events/ready.js"
import ChannelCreate from "../events/channel-create.js"
import MessageCreate from "../events/message-create.js"
import MessageDelete from "../events/message-delete.js"
import MessageUpdate from "../events/message-update.js"
import InteractionCreate from "../events/interaction-create.js"
import SlashCommandInteraction from "../events/customs/slash-command-interaction.js"
import VoiceStateUpdateHanlder from "../events/voice-state-update.js"
import VoiceChannelJoin from "../events/customs/join-voice-channel.js"
import VoiceChannelLeave from "../events/customs/leave-voice-channel.js"
import VoiceChannelSwitch from "../events/customs/switch-voice-channel.js"
import ButtonInteraction from "../events/customs/button-interaction.js"
import SelectMenuInteraction from "../events/customs/select-menu-interaction.js"
import ModalInteraction from "../events/customs/modal-interaction.js"

const EventsMap = {
	[Events.ClientReady]: Ready,
	[Events.ChannelCreate]: ChannelCreate,
	[Events.MessageCreate]: MessageCreate,
	[Events.MessageDelete]: MessageDelete,
	[Events.MessageUpdate]: MessageUpdate,
	[Events.InteractionCreate]: InteractionCreate,
	"slashCommandInteraction": SlashCommandInteraction,
	[Events.VoiceStateUpdate]: VoiceStateUpdateHanlder,
	"voiceChannelJoin": VoiceChannelJoin,
	"voiceChannelLeave": VoiceChannelLeave,
	"voiceChannelSwitch": VoiceChannelSwitch,
	"buttonInteraction": ButtonInteraction,
	"selectMenuInteraction": SelectMenuInteraction,
	"modalInteraction": ModalInteraction
}

export default EventsMap
