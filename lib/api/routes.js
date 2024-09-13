import { Router } from "express"
import * as c from "./controllers.js"

const router = Router()
export default router

router.get("/automaticmessages", c.getAutomaticMessages)
router.delete("/automaticmessages/:id", c.deleteAutomaticMessage)
router.post("/automaticmessages", c.createAutomaticMessage)
/*
router.get("/triggers", getTriggers)
router.post("/triggers", createTrigger)
router.delete("/triggers/:id", deleteTrigger)

router.get("/messageformats", getMessageFormats)
router.post("/messageformats", createMessageFormat)
router.delete("/messageformats/:id", deleteMessageFormat)
*/

