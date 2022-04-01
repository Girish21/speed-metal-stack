import type { ActionFunction } from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'
import * as dns from 'dns'
import { getRequiredEnvVar } from '~/utils/misc'

export const action: ActionFunction = async ({ request }) => {
  if (request.headers.get('auth') !== getRequiredEnvVar('REFRESH_TOKEN')) {
    return json({ message: 'Not Authorised' }, { status: 401 })
  }

  const body = await request.text()
  const address = `global.${getRequiredEnvVar('FLY_APP_NAME')}.internal`
  const ipv6s = await dns.promises.resolve6(address)

  const urls = ipv6s.map(ip => `http://[${ip}]:${getRequiredEnvVar('PORT')}`)

  const queryParams = new URLSearchParams()
  queryParams.set('_data', 'routes/_content/update-content')

  const fetches = urls.map(url =>
    fetch(`${url}/_content/update-content?${queryParams}`, {
      method: 'POST',
      body,
      headers: {
        auth: getRequiredEnvVar('REFRESH_TOKEN'),
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(body).toString(),
      },
    }),
  )

  const response = await Promise.all(fetches)

  return json(response)
}
