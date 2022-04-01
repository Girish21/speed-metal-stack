import type { getMdxListItems } from '~/utils/mdx.server'
import BlogItem from './blog-item'

type BlogListType = { blogList: Awaited<ReturnType<typeof getMdxListItems>> }

export default function BlogList({ blogList }: BlogListType) {
  return (
    <ol className='flex flex-col'>
      {blogList.map(blogItem => (
        <BlogItem key={blogItem.slug} {...blogItem} />
      ))}
    </ol>
  )
}
