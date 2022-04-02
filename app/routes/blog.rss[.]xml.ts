import type { LoaderFunction } from '@remix-run/server-runtime'
import * as dateFns from 'date-fns'
import invariant from 'tiny-invariant'

import { getMdxListItems } from '~/utils/mdx.server'
import { getDomainUrl } from '~/utils/misc'

export const loader: LoaderFunction = async ({ request }) => {
  const posts = await getMdxListItems({ contentDirectory: 'blog' })

  const blogUrl = `${getDomainUrl(request)}/blog`

  const rss = `
    <rss xmlns:blogChannel="${blogUrl}" version="2.0">
      <channel>
        <title>My Blog</title>
        <link>${blogUrl}</link>
        <description>My Blog</description>
        <language>en-us</language>
        <ttl>40</ttl>
        ${posts
          .map(post => {
            const frontMatter = JSON.parse(post.frontmatter)

            invariant(
              typeof frontMatter.title === 'string',
              `${post.slug} should have a title in fronte matter`,
            )
            invariant(
              typeof frontMatter.description === 'string',
              `${post.slug} should have a description in fronte matter`,
            )
            invariant(
              typeof post.timestamp === 'object',
              `${post.slug} should have a timestamp`,
            )

            return `
            <item>
              <title>${cdata(frontMatter.title ?? 'Untitled Post')}</title>
              <description>${cdata(
                frontMatter.description ?? 'This post is... indescribable',
              )}</description>
              <pubDate>${dateFns.format(
                dateFns.add(
                  post.timestamp
                    ? dateFns.parseISO(post.timestamp.toISOString())
                    : Date.now(),
                  { minutes: new Date().getTimezoneOffset() },
                ),
                'yyyy-MM-ii',
              )}</pubDate>
              <link>${blogUrl}/${post.slug}</link>
              <guid>${blogUrl}/${post.slug}</guid>
            </item>
          `.trim()
          })
          .join('\n')}
      </channel>
    </rss>
  `.trim()

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Content-Length': String(Buffer.byteLength(rss)),
    },
  })
}

function cdata(s: string) {
  return `<![CDATA[${s}]]>`
}
