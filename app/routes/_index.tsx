import { LoaderFunction, type MetaFunction } from '@remix-run/node'
import { redirect } from '@remix-run/react'
// import Header from '~/components/Header'

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export const loader: LoaderFunction = async ({ request }) => {
  return redirect('/quotes')
}

export default function Index() {
  return null
}
