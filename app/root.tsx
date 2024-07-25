import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react'

import { ThemeSwitcherSafeHTML, ThemeSwitcherScript } from '@/components/theme-switcher'

import { LoaderFunction, json } from '@remix-run/node'
import Header from './components/Header'
import './globals.css'
import { getUser } from './session.server'

export const loader: LoaderFunction = async ({ request }) => json({ user: await getUser(request) })

function App({ children }: { children: React.ReactNode }) {
  return (
    <ThemeSwitcherSafeHTML lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
        <ThemeSwitcherScript />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </ThemeSwitcherSafeHTML>
  )
}

export default function Root() {
  const { user } = useLoaderData<typeof loader>()

  return (
    <App>
      <Header user={user} />
      <Outlet />
    </App>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  let status = 500
  let message = 'An unexpected error occurred.'
  if (isRouteErrorResponse(error)) {
    status = error.status
    switch (error.status) {
      case 404:
        message = 'Page Not Found'
        break
    }
  } else {
    console.error(error)
  }

  return (
    <App>
      <div className='container prose py-8'>
        <h1>{status}</h1>
        <p>{message}</p>
      </div>
    </App>
  )
}
