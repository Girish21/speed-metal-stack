import type { ActionFunction } from '@remix-run/server-runtime'
import { json, redirect } from '@remix-run/server-runtime'
import { isTheme } from '~/utils/theme'
import { getThemeSession } from '~/utils/theme-session.server'

export const action: ActionFunction = async ({ request }) => {
  const { commit, setTheme } = await getThemeSession(request)
  const data = await request.text()
  const queryParams = new URLSearchParams(data)
  const theme = queryParams.get('theme')

  if (isTheme(theme)) {
    setTheme(theme)

    return json(null, { headers: { 'set-cookie': await commit() } })
  }

  return json({ message: 'Bad request' })
}

export const loader = () => redirect('/', { status: 404 })
