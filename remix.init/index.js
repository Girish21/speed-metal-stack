const path = require('path')
const fs = require('fs/promises')
const toml = require('@iarna/toml')
const crypto = require('crypto')
const sort = require('sort-package-json')
const inquirer = require('inquirer')

function escapeRegExp(string) {
  // $& means the whole matched string
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

async function main({ rootDirectory }) {
  const readmePath = path.join(rootDirectory, 'README.md')
  const envExamplePath = path.join(rootDirectory, '.env.example')
  const envPath = path.join(rootDirectory, '.env')
  const flyConfigPath = path.join(rootDirectory, 'fly.toml')
  const packagePath = path.join(rootDirectory, 'package.json')
  const rssPath = path.join(rootDirectory, 'app', 'routes', 'blog.rss[.]xml.ts')

  const projectName = path.basename(path.resolve(rootDirectory))
  const randomHash = crypto.randomBytes(2).toString('hex')
  const appName = `${projectName}-${randomHash}`
  const replacer = 'YOUR_APP_NAME'

  const [readme, envExample, flyConfig, packageJson, rss] = await Promise.all([
    fs.readFile(readmePath, 'utf-8'),
    fs.readFile(envExamplePath, 'utf-8'),
    fs.readFile(flyConfigPath, 'utf-8'),
    fs.readFile(packagePath, 'utf-8'),
    fs.readFile(rssPath, 'utf-8'),
  ])

  const { name: blogName, description: blogDescription } =
    await inquirer.prompt([
      {
        name: 'name',
        message: 'Enter the name of the blog: ',
        type: 'input',
        validate: input => {
          if (input.trim().length === 0) {
            return 'Enter a valid blog name'
          }
          return true
        },
      },
      {
        name: 'description',
        message: 'Enter the description of the blog: ',
        type: 'input',
        validate: input => {
          if (input.trim().length === 0) {
            return 'Enter a valid blog description'
          }
          return true
        },
      },
    ])

  console.info(
    `\n\n⚠️ You can change the name and description of the blog later at ${path.relative(
      rootDirectory,
      rssPath,
    )}\n\n`,
  )

  const flyConfigToml = toml.parse(flyConfig)
  flyConfigToml.app = appName

  const newreadme = readme.replace(
    new RegExp(escapeRegExp(replacer), 'g'),
    appName,
  )
  const newPackageJson =
    JSON.stringify(
      sort({ ...JSON.parse(packageJson), name: appName }),
      null,
      2,
    ) + '\n'

  let newRss = rss.replace(
    /<title>(.*)<\/title>/gi,
    `<title>${blogName}</title>`,
  )
  newRss = newRss.replace(
    /<description>(.*)<\/description>/gi,
    `<description>${blogDescription}</description>`,
  )

  await Promise.all([
    fs.writeFile(readmePath, newreadme),
    fs.writeFile(envPath, envExample),
    fs.writeFile(flyConfigPath, toml.stringify(flyConfigToml)),
    fs.writeFile(packagePath, newPackageJson),
    fs.writeFile(rssPath, newRss),
  ])
  console.log(
    `
Setup is almost complete. Follow these steps to finish initialization:

- Run setup (this updates the database):
  npm run setup

- Run the first build (this generates the server you will run):
  npm run build

- You're now ready to rock and roll 🤘
  npm run dev
  `.trim(),
  )
}

module.exports = main
