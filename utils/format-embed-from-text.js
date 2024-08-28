import { createEmbed } from "./discord-api/components.js"

export function formatText (text) {
	if (!text.startsWith("{embed}")) {
		return { content: text, embeds: [] }
	}

	const title = extractTextBetween(text, "{title}", "{endtitle}") || "Sin título"
	const description = extractTextBetween(
		text,
		"{description}",
		"{enddescription}"
	) || "Sin descripción"
	const color = extractTextBetween(text, "{color}", "{endcolor}")

	return {
		content: "",
		embeds: [
			createEmbed({
				title,
				description,
				color: formatColor(color)
			})
		]
	}
}

function extractTextBetween (text, startDelimiter, endDelimiter) {
	const regex = new RegExp(`${startDelimiter}(.*?)${endDelimiter}`, "s")
	const match = text.match(regex)
	return match ? match[1].trim() : null
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
