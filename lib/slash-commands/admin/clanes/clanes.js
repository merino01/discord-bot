import InfoCommand from "./info.js"
import CreateCommand from "./create.js"
import DeleteCommand from "./delete.js"
import UpdateTextCategoryCommand from "./update-text-category.js"
import UpdateVoiceCategoryCommand from "./update-voice-category.js"
import AddAdditionalRoleCommand from "./add-additional-role.js"
import RemoveAdditionalRoleCommand from "./remove-additional-role.js"
import AddLiderRoleCommand from "./add-lider-role.js"
import ArchiveCommand from "./archive.js"
import AddVoiceChannelCommand from "./add-voice-channel.js"

const AdminClanesCommands = {
	info: InfoCommand,
	create: CreateCommand,
	delete: DeleteCommand,
	updatetextcategory: UpdateTextCategoryCommand,
	updatevoicecategory: UpdateVoiceCategoryCommand,
	addadditionalrole: AddAdditionalRoleCommand,
	removeadditionalrole: RemoveAdditionalRoleCommand,
	addliderrole: AddLiderRoleCommand,
	archive: ArchiveCommand,
	addvoicechannel: AddVoiceChannelCommand
}

export default AdminClanesCommands
