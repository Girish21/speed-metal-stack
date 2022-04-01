const { fetchJSON, getChangedFiles } = require('./utils')

async function go() {
  const buildInfo = await fetchJSON({
    url: `https://${process.env.FLY_APP_NAME}.fly.dev/build/info.json`,
  })
  const sha = buildInfo.data.sha
  const compareSha = process.env.GITHUB_SHA
  const changes = getChangedFiles(sha, compareSha)

  const isDeployable =
    changes === null ||
    changes.length === 0 ||
    changes.some(({ filename }) => !filename.startsWith('content'))

  console.error(isDeployable ? '🟢 Deploy' : '🔴 Skip Deployment')

  console.log(isDeployable)
}

go().catch(error => {
  console.error(error)
  console.log(true)
})
