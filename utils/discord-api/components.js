import { EmbedBuilder } from "discord.js"
import { COLORS } from "../../enums/colors.js"

/* eslint-disable complexity */
export const createEmbed = ({
	color = COLORS.blue,
	title,
	url,
	author,
	description,
	thumbnail,
	fields,
	image,
	timestamp,
	footer
}) => {
	const embed = new EmbedBuilder()

	if (color) {
		embed.setColor(color)
	}

	if (title) {
		embed.setTitle(title)
	}

	if (url) {
		embed.setURL(url)
	}

	if (author) {
		embed.setAuthor(author)
	}

	if (description) {
		embed.setDescription(description)
	}

	if (thumbnail) {
		embed.setThumbnail(thumbnail)
	}

	if (fields) {
		embed.addFields(fields)
	}

	if (image) {
		embed.setImage(image)
	}

	if (timestamp) {
		embed.setTimestamp(new Date())
	}

	if (footer) {
		embed.setFooter(footer)
	}

	return embed
}
