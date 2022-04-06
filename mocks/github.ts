import nodepath from 'path'
import fs from 'fs-extra'
import type { DefaultRequestBody, MockedRequest, RestHandler } from 'msw'
import { rest } from 'msw'

async function isDirectory(d: string) {
  try {
    return (await fs.lstat(d)).isDirectory()
  } catch {
    return false
  }
}
async function isFile(d: string) {
  try {
    return (await fs.lstat(d)).isFile()
  } catch {
    return false
  }
}

type GHContentsDescription = {
  name: string
  path: string
  sha: string
  type: 'dir' | 'file'
}

export const GitHubMocks: Array<
  RestHandler<MockedRequest<DefaultRequestBody>>
> = [
  rest.get(
    'https://api.github.com/repos/:owner/:repo/contents/:path',
    async (req, res, ctx) => {
      const { owner, repo } = req.params

      if (typeof req.params.path !== 'string') {
        throw new Error('Path should be a string')
      }
      const path = decodeURIComponent(req.params.path).trim()

      if (
        `${owner}/${repo}` !== process.env.GITHUB_REPOSITORY ||
        !path.startsWith('content')
      ) {
        throw new Error(
          `Trying to fetch resource for unmockable resource: ${owner}/${repo}/${path}`,
        )
      }

      const localPath = nodepath.resolve(process.cwd(), path)
      const isLocalDir = await isDirectory(localPath)
      const isLocalFile = await isFile(localPath)

      if (!isLocalDir && !isLocalFile) {
        return res(
          ctx.status(200),
          // return an empty array when there are no blogs inside content/blogs
          ctx.json([]),
        )
      }

      if (isLocalFile) {
        const file = fs.readFileSync(localPath, { encoding: 'utf-8' })
        const encoding = 'base64'

        return res(
          ctx.status(200),
          ctx.json({
            content: Buffer.from(file, 'utf-8').toString(encoding),
            encoding,
          }),
        )
      }

      const dirList = await fs.readdir(localPath)

      const dirContent = await Promise.all(
        dirList.map(async (name): Promise<GHContentsDescription> => {
          const relativePath = nodepath.join(path, name)
          const sha = relativePath
          const fullPath = nodepath.resolve(process.cwd(), relativePath)
          const isDir = await isDirectory(fullPath)

          return {
            name,
            path: relativePath,
            sha,
            type: isDir ? 'dir' : 'file',
          }
        }),
      )

      return res(ctx.status(200), ctx.json(dirContent))
    },
  ),
  rest.get(
    'https://api.github.com/repos/:owner/:repo/git/blobs/:sha',
    async (req, res, ctx) => {
      const { repo, owner } = req.params

      if (typeof req.params.sha !== 'string') {
        throw new Error('sha should be a string')
      }
      const sha = decodeURIComponent(req.params.sha).trim()

      if (`${owner}/${repo}` !== process.env.GITHUB_REPOSITORY) {
        throw new Error(
          `Trying to fetch resource for unmockable resource: ${owner}/${repo}`,
        )
      }

      if (!sha.includes('/')) {
        throw new Error(`No mockable data found for the given sha: ${sha}`)
      }

      const fullPath = nodepath.resolve(process.cwd(), sha)
      const content = fs.readFileSync(fullPath, { encoding: 'utf-8' })
      const encoding = 'base64'

      return res(
        ctx.status(200),
        ctx.json({
          sha,
          content: Buffer.from(content, 'utf-8').toString(encoding),
          encoding,
        }),
      )
    },
  ),
  rest.get(
    'https://api.github.com/repos/:owner/:repo/contents/:path*',
    async (req, res, ctx) => {
      const { owner, repo } = req.params

      if (typeof req.params.path !== 'string') {
        throw new Error('Path should be a string')
      }
      const path = decodeURIComponent(req.params.path).trim()

      if (
        owner !== process.env.GH_OWNER ||
        repo !== process.env.GH_REPO ||
        !path.startsWith('content')
      ) {
        throw new Error(
          `Trying to fetch resource for unmockable resource: ${owner}/${repo}/${path}`,
        )
      }

      const fullPath = nodepath.resolve(process.cwd(), path)
      const content = fs.readFileSync(fullPath, { encoding: 'utf-8' })
      const encoding = 'base64'

      return res(
        ctx.status(200),
        ctx.json({
          sha: path,
          content: Buffer.from(content, 'utf-8').toString(encoding),
          encoding,
        }),
      )
    },
  ),
]
