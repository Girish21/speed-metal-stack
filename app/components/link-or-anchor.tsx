import type { LinkProps } from '@remix-run/react'
import { Link } from '@remix-run/react'
import * as React from 'react'

type AnchorProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> & {
  to?: LinkProps['to']
  prefetch?: LinkProps['prefetch']
  reloadDocument?: LinkProps['reloadDocument']
  download?: boolean
  href?: string
}

const LinkOrAnchor = React.forwardRef<HTMLAnchorElement, AnchorProps>(
  function LinkOrAnchorImpl(
    { reloadDocument, download, to, href, prefetch, children, ...rest },
    ref,
  ) {
    let url = ''
    let anchor = reloadDocument || download

    if (!anchor && typeof href === 'string') {
      anchor = href.includes(':') || href.includes('#')
    }
    if (!anchor && typeof to === 'string') {
      url = to
      anchor = to.includes(':')
    }
    if (!anchor && typeof to === 'object') {
      url = `${to.pathname ?? ''}${to.hash ? `#${to.hash}` : ''}${
        to.search ? `?${to.search}` : ''
      }`
      anchor = url.includes(':')
    }

    if (anchor) {
      return (
        <a {...rest} href={href} download={download} ref={ref}>
          {children}
        </a>
      )
    }

    return (
      <Link
        {...rest}
        ref={ref}
        reloadDocument={reloadDocument}
        to={to ?? href ?? ''}
        prefetch={prefetch}
      >
        {children}
      </Link>
    )
  },
)

export default LinkOrAnchor
