import { SkipNavContent, SkipNavLink } from '@reach/skip-nav'
import skipNavStyles from '@reach/skip-nav/styles.css'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import type { LinksFunction, LoaderFunction } from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'
import Nav from '~/components/nav'
import appStyles from '~/styles/app.css'
import Footer, { preloadFooterSvg } from './components/footer'
import { preloadSvg } from './components/theme-toggle'
import type { Theme } from './utils/theme'
import { SsrTheme, ThemeMeta, ThemeProvider, useTheme } from './utils/theme'
import { getThemeSession } from './utils/theme-session.server'

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
