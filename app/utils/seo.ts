import { initSeo } from 'remix-seo'

export const { getSeo, getSeoLinks, getSeoMeta } = initSeo({
  title: 'Remix Blog',
  description: 'Blog built using Remix',
  twitter: {
    card: 'summary',
    creator: '@handle',
    site: 'https://my-site.dev',
    title: 'Remix Blog',
    description: 'Blog built using Remix',
  },
})
