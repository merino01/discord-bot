import { PermissionFlagsBits } from "discord.js"
import config from "../config/config.js"

export const isMod = (user) => user.roles.cache.has(config.moderator_role_id) ||
  user.permissions.has(PermissionFlagsBits.Administrator)
