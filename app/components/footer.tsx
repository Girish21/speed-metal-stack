import * as React from 'react'

import LinkOrAnchor from './link-or-anchor'
import GitHubSvg from '~/assets/icons/github.svg'
import TwitterSvg from '~/assets/icons/twitter.svg'

export function preloadFooterSvg() {
  return [
    { rel: 'preload', href: GitHubSvg, as: 'image', type: 'image/svg+xml' },
    { rel: 'preload', href: TwitterSvg, as: 'image', type: 'image/svg+xml' },
  ]
}

export default function Footer() {
  return (
    <footer className='mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6'>
      <div className='flex flex-col gap-32 md:flex-row'>
        <div className='flex flex-col gap-8'>
          <h3 className='place-self-center text-4xl font-bold text-gray-800 dark:text-gray-100'>
            Remix Blog
          </h3>
          <ul className='flex items-center justify-center gap-6'>
            <Link href='https://github.com/remix-run/remix'>
              <Svg>
                <use href={`${GitHubSvg}#icon-github`} />
              </Svg>
              <span className='sr-only'>GitHub</span>
            </Link>
            <Link href='https://twitter.com/remix_run'>
              <Svg>
                <use href={`${TwitterSvg}#icon-twitter`} />
              </Svg>
              <span className='sr-only'>Twitter</span>
            </Link>
          </ul>
        </div>
        <div className='flex flex-col justify-center'>
          <ul className='flex flex-col items-center gap-4 md:items-start'>
            <Link href='/'>Home</Link>
            <Link href='/blog'>Blog</Link>
          </ul>
        </div>
      </div>
    </footer>
  )
}

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='h-6 w-6 text-gray-500 dark:text-gray-300'
    >
      {children}
    </svg>
  )
}

function Link({
  children,
  href,
  reload,
}: {
  children: React.ReactNode
  href: string
  reload?: boolean
}) {
  return (
    <li>
      <LinkOrAnchor
        href={href}
        reloadDocument={reload}
        className='text-xl text-gray-600 dark:text-gray-200'
        prefetch={!href.includes(':') ? 'intent' : 'none'}
      >
        {children}
      </LinkOrAnchor>
    </li>
  )
}
