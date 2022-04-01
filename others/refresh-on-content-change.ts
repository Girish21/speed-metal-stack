import chokidar from 'chokidar'
import path from 'path'
import fs from 'fs'
import { postJSON } from './utils'

const watchPath = path.resolve(process.cwd(), 'content')
const refreshPath = path.resolve(process.cwd(), 'app', 'refresh.ignore.js')

chokidar.watch(watchPath).on('change', changePath => {
  const relativeChangePath = changePath.replace(
    `${path.resolve(process.cwd(), 'content')}/`,
    '',
  )
  console.log('🛠 content changed', relativeChangePath)

  postJSON({
    http: require('http'),
    postData: {
      paths: [relativeChangePath],
    },
    overrideOptions: {
      hostname: 'localhost',
      port: 3000,
      path: `/_content/update-content?${new URLSearchParams([
        ['_data', 'routes/_content/update-content'],
      ])}`,
    },
  })
    .then(() => {
      console.log('🚀 Finished updating content')
      setTimeout(() => {
        fs.writeFileSync(refreshPath, `// ${new Date()}`)
      }, 250)
    })
    .catch(err => {
      console.error(err)
    })
})
