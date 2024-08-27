import config from "../config/config.js"

const { admin_id } = config

let client = null

export default async function (message, c) {
	if (c) { client = c }

	let admin = client?.users.cache.get(admin_id)
	if (!admin) {
		admin = await client?.users.fetch(admin_id)
	}

	admin?.send({ content: message })
}
