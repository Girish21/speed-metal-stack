import db from '~/utils/db.server'

export async function getContentState() {
  const rows = await db.contentState.findUnique({
    select: { sha: true, timestamp: true },
    where: { key: 'content' },
  })

  return rows
}

export async function setContentSHA(sha: string) {
  return db.contentState.upsert({
    where: { key: 'content' },
    create: { sha, key: 'content' },
    update: { sha },
  })
}
