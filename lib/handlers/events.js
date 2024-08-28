import EventsMap from "../dictionaries/events.js"
import logger from "../logger/logger.js"

const start = (client) => {
	let loadedEvents = 0
	for (const [event, handler] of Object.entries(EventsMap)) {
		try {
			client.on(event, handler.bind(null, client))
			logger.info(`Event loaded: '${event}'`)
			loadedEvents++
		} catch (error) {
			logger.error(`Event: ${event} failed to load`)
			logger.error(error)
		}
	}
	logger.info(`${loadedEvents} events loaded`)
}

const EventHandler = { start }
export default EventHandler
