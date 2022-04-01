import * as React from 'react'
import type { NavLinkProps } from '@remix-run/react'
import { NavLink as RemixNavLink } from '@remix-run/react'
import clsx from 'clsx'

export default function NavLink({ className, ...rest }: NavLinkProps) {
  return (
    <RemixNavLink
      className={({ isActive }) =>
        clsx(
          'text-xl text-gray-800 dark:text-gray-50',
          isActive ? 'underline underline-offset-2' : null,
          className,
        )
      }
      {...rest}
    />
  )
}
