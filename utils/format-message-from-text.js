import { createEmbed } from "./discord-api/components.js"

export function formatText (text) {
	if (!text.startsWith("{richmessage}")) {
		return { content: text }
	}

	const embeds = []
	const content = extractTextBetween(text, "{content}", "{endcontent}")

	const embedText = extractTextBetween(text, "{embed}", "{endembed}")
	if (embedText.trim()) {
		const embed = formatEmbed(embedText)
		if (embed) {
			embeds.push(embed)
		}
	}

	return {
		content,
		embeds
	}
}

function extractTextBetween (text, startDelimiter, endDelimiter) {
	const regex = new RegExp(`${startDelimiter}(.*?)${endDelimiter}`, "s")
	const match = text.match(regex)
	return match ? match[1].trim() : ""
}

function formatColor (hex) {
	if (!hex) {
		return undefined
	}

	if (hex.startsWith("#")) {
		hex = hex.slice(1)
	}
	const color = parseInt(hex, 16)
	return isNaN(color) ? undefined : color
}

function formatEmbed (text) {
	const title = extractTextBetween(text, "{title}", "{endtitle}") || "Sin título"
	const description = extractTextBetween(
		text,
		"{description}",
		"{enddescription}"
	) || "Sin descripción"
	const color = extractTextBetween(text, "{color}", "{endcolor}")

	if (!title || !description) {
		return null
	}

	return createEmbed({
		title,
		description,
		color: formatColor(color)
	})
}
