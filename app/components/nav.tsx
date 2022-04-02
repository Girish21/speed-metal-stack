import * as React from 'react'
import NavLink from './nav-link'
import ThemeToggle, { SsrPlaceholder } from './theme-toggle'
import { ClientOnly } from './client-only'

export default function Nav() {
  return (
    <header className='py-8 px-6'>
      <nav className='mx-auto flex max-w-4xl items-center justify-between'>
        <div className='flex items-center gap-4'>
          <NavLink to='/'>Home</NavLink>
          <NavLink prefetch='intent' to='/blog'>
            Blog
          </NavLink>
        </div>
        {/*
         * Since the correct theme on the initial render is known at
         * the client, we'll render the theme toggle at the client
         * after hydration
         */}
        <ClientOnly fallback={<SsrPlaceholder />}>
          {() => <ThemeToggle />}
        </ClientOnly>
      </nav>
    </header>
  )
}
