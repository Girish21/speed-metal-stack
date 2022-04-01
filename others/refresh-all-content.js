const { postJSON } = require('./utils')

async function go() {
  const compareSha = process.env.GITHUB_SHA

  const response = await postJSON({
    postData: { refreshAll: true, sha: compareSha },
  })

  console.error('Content refreshed 🚀', { response })
}

go().catch(error => {
  console.error(error)
})
