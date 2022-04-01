import { createCookieSessionStorage } from '@remix-run/node'
import { getRequiredEnvVar } from './misc'
import type { Theme } from './theme'

const { commitSession, getSession } = createCookieSessionStorage({
  cookie: {
    path: '/',
    sameSite: 'lax',
    name: 'theme',
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 100),
    secrets: [getRequiredEnvVar('SESSION_SECRETS')],
    secure: true,
  },
})

export async function getThemeSession(request: Request) {
  const themeSession = await getSession(request.headers.get('Cookie'))

  return {
    getTheme: (): Theme | null => themeSession.get('theme') || null,
    setTheme: (theme: Theme) => themeSession.set('theme', theme),
    commit: async () => commitSession(themeSession),
  }
}
