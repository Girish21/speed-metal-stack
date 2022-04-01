const execSync = require('child_process').execSync

async function fetchJSON({ http = require('https'), url }) {
  return new Promise((resolve, reject) => {
    try {
      const req = http.get(url, res => {
        let data = ''
        res.on('data', chunk => (data += chunk))
        res
          .on('end', () => {
            try {
              resolve(JSON.parse(data))
            } catch (e) {
              reject(e)
            }
          })
          .on('error', error => {
            reject(error)
          })
      })
      req.on('error', error => {
        reject(error)
      })
    } catch (error) {
      reject(error)
    }
  })
}

async function postJSON({
  http = require('https'),
  postData,
  overrideOptions = {},
  overrideHeaders = {},
}) {
  return new Promise((resolve, reject) => {
    const postDataString = JSON.stringify(postData)
    const searchParams = new URLSearchParams([
      ['_data', 'routes/_content/refresh-content'],
    ])
    const options = {
      hostname: `${process.env.FLY_APP_NAME}.fly.dev`,
      port: 443,
      path: `/_content/refresh-content?${searchParams}`,
      method: 'POST',
      headers: {
        auth: process.env.REFRESH_TOKEN,
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(postDataString),
        ...overrideHeaders,
      },
      ...overrideOptions,
    }
    try {
      const req = http.request(options, res => {
        let data = ''

        res.on('data', chunk => {
          data += chunk
        })
        res.on('end', () => {
          try {
            resolve(JSON.parse(data))
          } catch (e) {
            console.error('Error!', err.message)
            reject(data)
          }
        })
        res.on('error', err => {
          console.error('Error!', err.message)
          reject(ree)
        })
      })
      req.write(postDataString)
      req.end()
    } catch (e) {
      console.error('Error!', e.message)
      reject(e)
    }
  })
}

function getChangedFiles(sha, compareSha) {
  try {
    const pattern = /^(?<change>\w).*?\s+(?<filename>.+$)/

    const diff = execSync(
      `git diff --name-status ${sha} ${compareSha}`,
    ).toString()

    const changedFiles = diff
      .split('\n')
      .map(line => line.match(pattern)?.groups)
      .filter(Boolean)

    const changes = []
    for (const { change, filename } of changedFiles) {
      changes.push({ change, filename })
    }

    return changes
  } catch (e) {
    console.error(e)
    return null
  }
}

module.exports = { fetchJSON, getChangedFiles, postJSON }
