import type { LoaderFunction } from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'
import { getContentState } from '~/model/content-state.server'

export const loader: LoaderFunction = async () => {
  const rows = await getContentState()
  const data = rows || {}

  return json(data, {
    headers: {
      'content-length': Buffer.byteLength(JSON.stringify(data)).toString(),
    },
  })
}
