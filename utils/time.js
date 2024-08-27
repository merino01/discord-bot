export const ONE_SECOND = 1000
export const ONE_MINUTE = ONE_SECOND * 60
export const ONE_HOUR = ONE_MINUTE * 60
export const ONE_DAY = ONE_HOUR * 24
export const ONE_WEEK = ONE_DAY * 7
export const ONE_MONTH = ONE_DAY * 30

export const msToTime = (ms) => {
	const days = Math.floor(ms / ONE_DAY)
	const hours = Math.floor((ms % ONE_DAY) / ONE_HOUR)
	const minutes = Math.floor((ms % ONE_HOUR) / ONE_MINUTE)
	const secs = Math.floor((ms % ONE_MINUTE) / ONE_SECOND)

	const time = []
	if (days) { time.push(`${days}d`) }
	if (hours) { time.push(`${hours}h`) }
	if (minutes) { time.push(`${minutes}m`) }
	if (secs) { time.push(`${secs}s`) }

	return time.join(" ")
}

export const addSecondsToDate = (seconds) => {
	const now = new Date()
	const milliseconds = seconds * 1000
	const newTime = now.getTime() + milliseconds
	return new Date(newTime).toISOString()
}
