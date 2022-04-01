/* eslint-disable no-var */
import { PrismaClient } from '@prisma/client'
import { getRequiredEnvVar } from './misc'

declare global {
  var client: PrismaClient | undefined
}

let client: PrismaClient

if (getRequiredEnvVar('NODE_ENV') === 'production') {
  client = new PrismaClient()
} else {
  if (!global.client) {
    global.client = client = new PrismaClient()
  } else {
    client = global.client
  }
}

export default client
