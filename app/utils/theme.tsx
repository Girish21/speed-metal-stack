import * as React from 'react'
import { useFetcher } from '@remix-run/react'

export enum Theme {
  light = 'light',
  dark = 'dark',
}

type ThemeContextType = [
  Theme | null,
  React.Dispatch<React.SetStateAction<Theme | null>>,
]

const themes = Object.values(Theme)

const ThemeContext = React.createContext<ThemeContextType | null>(null)

const themeMediaQuery = '(prefers-color-scheme: dark)'

const getPrefferedTheme = () => {
  return window.matchMedia(themeMediaQuery).matches ? Theme.dark : Theme.light
}

export function ThemeProvider({
  children,
  ssrTheme,
}: {
  children: React.ReactNode
  ssrTheme: Theme | null
}) {
  const [theme, setTheme] = React.useState<Theme | null>(() => {
    if (ssrTheme) {
      if (themes.includes(ssrTheme)) {
        return ssrTheme
      } else {
        return null
      }
    }

    if (typeof window === 'undefined') {
      return null
    }

    return getPrefferedTheme()
  })

  const themeFetcher = useFetcher()
  const skipFirstRender = React.useRef(true)
  const themeFetcherRef = React.useRef(themeFetcher)

  React.useEffect(() => {
    if (skipFirstRender.current) {
      skipFirstRender.current = false
      return
    }
    if (!theme) {
      return
    }

    themeFetcherRef.current.submit(
      { theme },
      { method: 'post', action: '_action/set-theme' },
    )
  }, [theme])

  React.useEffect(() => {
    const media = window.matchMedia(themeMediaQuery)

    function handleThemeChange() {
      setTheme(media.matches ? Theme.dark : Theme.light)
    }

    media.addEventListener('change', handleThemeChange)

    return () => {
      window.removeEventListener('change', handleThemeChange)
    }
  }, [])

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const data = React.useContext(ThemeContext)

  if (!data) {
    throw new Error('useTheme should only be used under ThemeProvider')
  }

  return data
}

export function isTheme(theme: unknown): theme is Theme {
  return typeof theme === 'string' && themes.includes(theme as Theme)
}

export function ThemeMeta() {
  const [theme] = useTheme()

  return (
    <meta
      name='color-scheme'
      content={theme === Theme.dark ? 'dark light' : 'light dark'}
    />
  )
}

export function SsrTheme({ serverTheme }: { serverTheme?: boolean }) {
  return (
    <>
      {serverTheme ? null : (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const theme = window.matchMedia('${themeMediaQuery}').matches ? 'dark' : 'light'
              const themeMeta = document.querySelector('meta[name=color-scheme]')
              const cl = document.documentElement.classList

              themeMeta.content = theme === 'light' ? 'light dark' : 'dark light'

              if (theme === 'light') {
                cl.remove('dark')
                cl.add('light')
              }
            `,
          }}
        />
      )}
    </>
  )
}
