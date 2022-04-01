import * as React from 'react'
import type {
  HeadersFunction,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from 'remix'
import { useLoaderData } from 'remix'
import { getMDXComponent } from 'mdx-bundler/client'
import { json } from 'remix'
import invariant from 'tiny-invariant'
import { getMdxPage } from '~/utils/mdx.server'
import type { MdxComponent } from '~/types'

import styles from 'highlight.js/styles/night-owl.css'
import { getSeoMeta } from '~/utils/seo'

export const meta: MetaFunction = ({ data }: { data: MdxComponent }) => {
  const seoMeta = getSeoMeta({
    title: data.title,
    description: data.description,
    twitter: {
      description: data.description,
      title: data.title,
    },
  })

  return { ...seoMeta }
}

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    'cache-control':
      loaderHeaders.get('cache-control') ?? 'private, max-age=60',
    Vary: 'Cookie',
  }
}

export const loader: LoaderFunction = async ({ params }) => {
  const slug = params.slug
  invariant(typeof slug === 'string', 'Slug should be a string, and defined')

  const mdxPage = await getMdxPage({ contentDirectory: 'blog', slug })

  if (!mdxPage) {
    throw json(null, { status: 404 })
  }

  return json<MdxComponent>(mdxPage, {
    headers: { 'cache-control': 'private, max-age: 60', Vary: 'Cookie' },
  })
}

export default function Blog() {
  const data = useLoaderData<MdxComponent>()

  const Component = React.useMemo(() => getMDXComponent(data.code), [data])

  return (
    <article className='prose prose-zinc mx-auto min-h-screen max-w-4xl pt-24 dark:prose-invert lg:prose-lg'>
      <Component />
    </article>
  )
}
