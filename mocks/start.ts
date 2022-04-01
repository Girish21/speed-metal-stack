import { setupServer } from 'msw/node'
import { GitHubMocks } from './github'

const server = setupServer(...GitHubMocks)

server.listen({ onUnhandledRequest: 'warn' })
console.info('MSW initialised')

process.once('SIGINT', () => server.close())
process.once('SIGTERM', () => server.close())
