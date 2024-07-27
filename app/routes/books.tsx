import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { getBooks } from '@/db/book.db'
import { cn } from '@/lib/styles'
import { requireUserId } from '@/session.server'
import { LoaderFunction } from '@remix-run/node'
import { Link, Outlet, json, redirect, useLoaderData, useRouteError } from '@remix-run/react'
import _ from 'lodash'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

type LoaderData = {
  books: Awaited<ReturnType<typeof getBooks>>
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request)

  const books = await getBooks(userId)
  const { bookId } = params

  if (!books.length) {
    throw new Response('No books found', { status: 404 })
  }

  if (!bookId) {
    return redirect(`/books/${books[0].id}`)
  }

  return json<LoaderData>({ books })
}

export function ErrorBoundary() {
  const error = useRouteError()

  return (
    <div className='text-red-500'>
      Oh no, something went wrong!
      <pre>{_.get(error, 'data')}</pre>
    </div>
  )
}

const Books = () => {
  const { books } = useLoaderData() as unknown as LoaderData
  // const setEditBookModalState = useSetAtom(modalStateAtom('editBook'))
  // const [loading, setLoading] = useState({} as any)
  const [hideDisabled, setHideDisabled] = useState(false)
  const { bookId } = useParams()

  return (
    <div className='flex h-[calc(100vh-57px)]'>
      <div className='h-full border-r'>
        <h2 className='text-center text-xl border-b p-2'>Books</h2>
        <NavigationMenu className='p-2'>
          <NavigationMenuList className='flex-col'>
            {books.map(({ id, title }) => (
              <NavigationMenuItem
                key={id}
                className={cn('py-1', id === Number(bookId) ? 'text-white' : 'text-gray-300')}
              >
                <NavigationMenuLink asChild>
                  <Link to={`./${id}`}>{title}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className='flex-1'>
        <Outlet />
      </div>
    </div>
  )
}

export default Books
