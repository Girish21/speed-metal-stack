import * as React from 'react'
import { Link } from 'remix'
import type { getMdxListItems } from '~/utils/mdx.server'

type BlogItem = Awaited<ReturnType<typeof getMdxListItems>>[0]

export default function BlogItem({ description, slug, title }: BlogItem) {
  return (
    <li className='py-4'>
      <Link
        prefetch='intent'
        to={`/blog/${slug}`}
        className='flex flex-col gap-2'
      >
        <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-50'>
          {title}
        </h2>
        <p className='text-base text-gray-600 dark:text-gray-200'>
          {description}
        </p>
        <div className='text-base font-bold text-gray-800 dark:text-gray-100'>
          Read more
        </div>
      </Link>
    </li>
  )
}
