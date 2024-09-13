import express from "express"
import logger from "../logger/logger.js"
import router from "./routes.js"
import cors from "cors"

const port = 3000

const start = (client) => {
	const app = express()

	app.use(express.json())
	app.use(cors())
	app.use("/api", router)

	app.listen(port, () => {
		logger.info(`API running on port ${port}`)
	})
}

export default { start }
