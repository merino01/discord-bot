import sqlite3 from "sqlite3"
import PathsHelper from "../../helpers/paths-helper.js"

const { Database } = sqlite3.verbose()
const db = new Database(PathsHelper.DATABASE_PATH)

// eslint-disable-next-line max-lines-per-function
export async function createTables () {
	await RUN({
		query: `
      CREATE TABLE IF NOT EXISTS buttons (
        id TEXT PRIMARY KEY,
        data TEXT
      )
    `
	})

	await RUN({
		query: `
      CREATE TABLE IF NOT EXISTS clanes (
        id TEXT PRIMARY KEY,
        name TEXT,
        liders TEXT,
        members TEXT,
        roleId TEXT,
        textChannelIds TEXT,
        voiceChannelIds TEXT,
        lider_roles TEXT,
        additional_roles TEXT,
        text_parent_id TEXT,
        voice_parent_id TEXT,
        created_at TEXT,
        deleted BOOLEAN,
        deleted_at TEXT,
        archived BOOLEAN,
        archived_at TEXT
      )
    `
	})

	await RUN({
		query: `
      CREATE TABLE IF NOT EXISTS triggers (
        id TEXT PRIMARY KEY,
        name TEXT,
        description TEXT,
        key TEXT,
        case_sensitive BOOLEAN,
        action TEXT,
        reply TEXT,
        text_position TEXT
      )
    `
	})

	await RUN({
		query: `
			CREATE TABLE IF NOT EXISTS message_formats (
				id TEXT PRIMARY KEY,
				name TEXT,
				description TEXT,
				regex TEXT,
				regex_flags TEXT,
				channelId TEXT,
				timeout INTEGER
			)
		`
	})

	await RUN({
		query: `
			CREATE TABLE IF NOT EXISTS channel_auto_messages (
				id TEXT PRIMARY KEY,
				title TEXT,
				message TEXT,
				categoryId TEXT,
				timeout INTEGER,
				color TEXT
			)
		`
	})

	await RUN({
		query: `
			CREATE TABLE IF NOT EXISTS pending_messages (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				channel_id TEXT,
				message_id TEXT,
				delete_at TEXT
			)
		`
	})
}

export async function GET_ONE ({ query, params = [] }) {
	return new Promise((resolve, reject) => {
		db.get(query, params, (error, row) => {
			if (error) {
				reject(error)
			}
			resolve(row)
		})
	})
}

export async function RUN ({ query, params = [] }) {
	return new Promise((resolve, reject) => {
		db.run(query, params, (error) => {
			if (error) {
				reject(error)
			}
			resolve()
		})
	})
}

export async function GET_MANY ({ query, params = [] }) {
	return new Promise((resolve, reject) => {
		db.all(query, params, (error, rows) => {
			if (error) {
				reject(error)
			}
			resolve(rows)
		})
	})
}
