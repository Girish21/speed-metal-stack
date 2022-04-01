import type TQueue from 'p-queue'

let _queue: TQueue | null = null
export async function getQueue() {
  const { default: PQueue } = await import('p-queue')

  if (_queue) {
    return _queue
  }

  _queue = new PQueue({ concurrency: 1 })

  return _queue
}
