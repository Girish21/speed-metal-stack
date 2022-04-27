import * as React from 'react'
import { useLoaderData } from '@remix-run/react'
import type {
  HeadersFunction,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'
import BlogList from '~/components/blog-list'
import { getMdxListItems } from '~/utils/mdx.server'
import { getSeo } from '~/utils/seo'

type LoaderData = { blogList: Awaited<ReturnType<typeof getMdxListItems>> }

const [seoMeta, seoLinks] = getSeo()

export const meta: MetaFunction = () => {
  return { ...seoMeta }
}

export const links: LinksFunction = () => {
  return [...seoLinks]
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    'cache-control':
      loaderHeaders.get('cache-control') ?? 'private, max-age=60',
    Vary: 'Cookie',
  }
}

export const loader: LoaderFunction = async () => {
  const blogList = await getMdxListItems({ contentDirectory: 'blog' })

  return json<LoaderData>(
    { blogList: blogList.slice(0, 10) },
    { headers: { 'cache-control': 'private, max-age=60' } },
  )
}

export default function Index() {
  const { blogList } = useLoaderData<LoaderData>()

  return (
    <>
      <section className='mx-auto max-w-4xl'>
        <div className='grid h-[calc(100vh-92px)] place-content-center'>
          <h1 className='flex flex-col items-center p-4'>
            <GradientText>Remix</GradientText>
            <GradientText>Blog</GradientText>
          </h1>
        </div>
      </section>
      <section className='mx-auto mt-32 w-[90vw]'>
        <div className='mx-auto max-w-4xl'>
          <h2 className='text-xl text-gray-800 dark:text-gray-100'>
            Recent Posts
          </h2>
          <BlogList blogList={blogList} />
        </div>
      </section>
    </>
  )
}

function GradientText(props: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className='bg-gradient-to-r from-sky-600 via-pink-500 to-red-600 bg-clip-text text-center text-6xl leading-snug text-transparent dark:via-blue-400 dark:to-green-300'
      {...props}
    />
  )
}
