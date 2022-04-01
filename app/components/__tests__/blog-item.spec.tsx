import * as React from 'react'
import type { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import BlogItem from '../blog-item'
import { BrowserRouter } from 'react-router-dom'

function Wrapper({ children }: { children: ReactNode }) {
  return <BrowserRouter>{children}</BrowserRouter>
}

describe('Blog Item', () => {
  it('Simple test', () => {
    render(
      <BlogItem
        description='Sample blog for test'
        slug='blog'
        timestamp={new Date()}
        title='Test blog'
      />,
      { wrapper: Wrapper },
    )

    expect(screen.getByRole('link')).toBeInTheDocument()
  })
})
