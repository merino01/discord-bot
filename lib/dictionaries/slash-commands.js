import AdminCommands from "../slash-commands/admin/admin-commands.js"
import ClanCommands from "../slash-commands/users/clan/clan-commands.js"

const SlashCommandsMap = {
	admin: AdminCommands,
	clan: ClanCommands
}

export default SlashCommandsMap
