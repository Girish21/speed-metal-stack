type GitHubFile = {
  content: string
  path: string
}

type MdxPage = {
  code: string
  slug: string
  frontmatter: {
    published?: boolean
    title?: string
    description?: string
    meta?: Record<string, string | string[]> & {
      keywords?: Array<string>
    }
    date?: string
  }
}

type MdxComponent = {
  frontmatter: MdxPage['frontmatter']
  slug: string
  title: string
  code: string
  timestamp: Date
  description?: string
}

export type { GitHubFile, MdxPage, MdxComponent }
