export default function (user, clan) {
	return clan.liders.includes(user.id)
}
