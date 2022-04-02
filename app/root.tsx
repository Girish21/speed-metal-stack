import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import { json } from '@remix-run/server-runtime'
import type { LinksFunction, LoaderFunction } from '@remix-run/server-runtime'
import { SkipNavContent, SkipNavLink } from '@reach/skip-nav'

import Nav from '~/components/nav'
import Footer, { preloadFooterSvg } from './components/footer'
import {
  SsrTheme,
  Theme,
  ThemeMeta,
  ThemeProvider,
  useTheme,
} from './utils/theme'
import { getThemeSession } from './utils/theme-session.server'
import { preloadSvg } from './components/theme-toggle'

import appStyles from '~/styles/app.css'
import skipNavStyles from '@reach/skip-nav/styles.css'

type LoaderData = { theme: Theme | null }

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: skipNavStyles },
    { rel: 'stylesheet', href: appStyles },
    {
      rel: 'preload',
      href: '/fonts/Poppins-Regular.ttf',
      as: 'font',
      type: 'font/ttf',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'preload',
      href: '/fonts/Poppins-Bold.ttf',
      as: 'font',
      type: 'font/ttf',
      crossOrigin: 'anonymous',
    },
    ...preloadSvg(),
    ...preloadFooterSvg(),
  ]
}

export const loader: LoaderFunction = async ({ request }) => {
  const { getTheme } = await getThemeSession(request)

  return json<LoaderData>({ theme: getTheme() })
}

function App() {
  const [theme] = useTheme()

  return (
    <html lang='en' className={`h-full ${theme ? theme : 'dark'}`}>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <ThemeMeta />
        <Meta />
        <Links />
      </head>
      <body className='h-full bg-white dark:bg-slate-800'>
        <SkipNavLink className='bg-gray-700'>Skip to content</SkipNavLink>
        <div className='flex h-full flex-col'>
          <Nav />
          <main className='flex-1 px-6'>
            <SkipNavContent />
            <Outlet />
          </main>
          <Footer />
        </div>
        <SsrTheme serverTheme={!!theme} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export default function AppProviders() {
  const { theme } = useLoaderData<LoaderData>()

  return (
    <ThemeProvider ssrTheme={theme}>
      <App />
    </ThemeProvider>
  )
}
