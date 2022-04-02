import fs from 'fs-extra'
import path from 'path'
import inquirer from 'inquirer'
import slugify from 'lodash.kebabcase'

async function go() {
  console.log("\nLet's create a new blog 💿\n")

  const blogsPath = path.resolve(process.cwd(), 'content', 'blog')

  if (!fs.existsSync(blogsPath)) {
    fs.mkdirSync(blogsPath)
  }

  const blogs = fs
    .readdirSync(blogsPath)
    .map(blog => blog.replace(/(\.mdx?)?$/, ''))

  const title = (
    await inquirer.prompt<{ name: string }>([
      {
        type: 'input',
        name: 'name',
        message: 'What is the title of the blog?',
        validate: input => {
          if (!input) {
            return 'Enter a valid name for the blog.'
          }
          const slug = slugify(input)
          if (blogs.includes(slug)) {
            return `Blog named ${input} alread exist, enter another blog name.`
          }
          return true
        },
      },
    ])
  ).name

  const slug = slugify(title)

  const { keywords, description, published, folder } = await inquirer.prompt<{
    description: string
    published: boolean
    folder: string
    keywords: string
  }>([
    {
      type: 'input',
      name: 'keywords',
      message: 'Enter the blog keywords (comma separated)',
      filter: (input: string) => input.trim(),
      validate: (input: string) => {
        if (input.trim().length === 0) {
          return 'Enter a keyword'
        }
        return true
      },
    },
    {
      type: 'editor',
      name: 'description',
      message: 'Enter the blog description',
      filter: (input: string) => input.trim(),
      validate: (input: string) => {
        if (input.trim().length === 0) {
          return 'Enter a description for the blog'
        }
        return true
      },
    },
    {
      type: 'list',
      name: 'published',
      message: 'Is the blog ready to be published?',
      choices: [
        { name: 'Publish', value: true },
        { name: 'Draft', value: false },
      ],
    },
    {
      type: 'list',
      name: 'folder',
      message: 'Will the MDX contain any custom components?',
      choices: [
        { name: 'No', value: false },
        { name: 'Yes', value: true },
      ],
    },
  ])

  const data = `---
slug: ${slug}
title: ${title}
date: ${new Date().toISOString()}
description: ${description}
meta:
  keywords:
${keywords
  .split(/, ?/)
  .map(keyword => `    - ${keyword}`)
  .join('\n')}
published: ${published}
---

# ${title}
`

  let relativePath = ''

  if (folder) {
    let filePath = path.resolve(blogsPath, slug)
    fs.mkdirSync(filePath)

    filePath = path.resolve(filePath, 'index.mdx')
    relativePath = path.relative(process.cwd(), filePath)
    fs.writeFileSync(filePath, data)
  } else {
    const filePath = path.resolve(blogsPath, `${slug}.mdx`)
    relativePath = path.relative(process.cwd(), filePath)
    fs.writeFileSync(filePath, data)
  }

  console.log(
    `\nBlog created 🚀\n\`cd\` into ${relativePath}\nOpen it in you favorite text editor, and get started!\n`,
  )
}

go().catch(err => {
  console.error(err)
  process.exit(1)
})
