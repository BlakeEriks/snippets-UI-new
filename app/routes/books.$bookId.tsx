import { Button } from '@/components/ui/button'
import { getBooks } from '@/db/book.db'
import { cn } from '@/lib/styles'
import { requireUserId } from '@/session.server'
import { ActionFunction, LoaderFunctionArgs } from '@remix-run/node'
import {
  Form,
  json,
  redirect,
  useLoaderData,
  useNavigate,
  useParams,
  useSubmit,
} from '@remix-run/react'
import _ from 'lodash'
import { Copy, Edit2, Heart, Undo2, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request)
  const { bookId } = params
  const books = await getBooks(userId)

  if (!bookId) return redirect(`/books/${books[0].id}`)

  const book = books.find(book => book.id === Number(bookId))
  if (!book) {
    throw new Response(null, {
      status: 404,
      statusText: 'Book not found',
    })
  }

  return json({ book })
}

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData()
  const intent = formData.get('intent')

  console.log('action', intent)

  if (intent === 'favorite') {
    // await toggleFavorite()
    console.log(formData.get('quoteId'))
    console.log(formData.get('userId'))
  }

  return { message: 'Hello World' }
}

const CopyButton = ({ content }: { content: string }) => {
  const handleCopy = useCallback(
    _.debounce(
      () => {
        navigator.clipboard.writeText(content)
        toast.success('Copied!')
      },
      500,
      { leading: true }
    ),
    []
  )

  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={handleCopy}
      className='opacity-50 hover:opacity-80 transition-all scale-110'
    >
      <Copy className='shrink-0' size={12} />
    </Button>
  )
}

const BookPage = () => {
  const { book } = useLoaderData<typeof loader>()
  const { bookId } = useParams()
  const [loading, setLoading] = useState({} as any)
  const [hideDisabled, setHideDisabled] = useState(false)
  const navigate = useNavigate()
  const submit = useSubmit()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    submit(formData, { method: 'post' })
  }

  // const setEditBookModalState = useSetAtom(modalStateAtom('editBook'))
  // const setEditQuoteModalState = useSetAtom(modalStateAtom('editQuote'))
  // const { save } = useQuoteApi()
  // const { favorites, addFavorite, removeFavorite } = useUserApi()
  // const toggleFavorite = (quoteId: number) => {
  //   if (favorites?.includes(quoteId)) {
  //     removeFavorite(quoteId)
  //   } else {
  //     addFavorite(quoteId)
  //   }
  // }

  const handleCopy = _.debounce(() => {
    navigator.clipboard.writeText(content)
    toast.success('Copied!')
  }, 300)

  return (
    <div className='w-full columns-3 overflow-y-auto'>
      {book?.quotes.map(({ content, id, quotee, deleted, createdAt }) =>
        deleted && hideDisabled ? null : (
          <Form key={id} method='post' onSubmit={handleSubmit}>
            <div
              className={cn(
                'flex p-6 pr-3 border-b border-r break-inside-avoid group',
                loading[id] && 'opacity-50'
              )}
            >
              <div className='my-auto flex-1'>
                <div className='flex items-center mb-2' key={id}>
                  <span
                    className={cn('italic text-sm flex-1', deleted && 'line-through opacity-50')}
                  >
                    "{content}"
                  </span>
                </div>
                <div className='flex justify-between text-xs opacity-60'>
                  <span>{new Date(createdAt).toLocaleDateString()}</span>
                  {quotee && <div>{quotee}</div>}
                </div>
              </div>
              <div className='flex flex-col justify-center'>
                <Button
                  type='submit'
                  name='intent'
                  value='favorite'
                  variant='ghost'
                  size='sm'
                  disabled={loading[id]}
                  // onClick={() => toggleFavorite(id)}
                  className='opacity-50 hover:opacity-80 transition-all scale-110'
                >
                  <Heart
                    className={cn('shrink-0')}
                    size={12}
                    // fill={favorites?.includes(id) ? 'red' : 'none'}
                  />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  disabled={loading[id]}
                  // onClick={() => setEditQuoteModalState({ id, quotee, content, bookId })}
                  className='opacity-50 hover:opacity-80 transition-all scale-110'
                >
                  <Edit2 className='shrink-0' size={12} />
                </Button>
                <CopyButton content={content} />
                <Button
                  variant='ghost'
                  size='sm'
                  disabled={loading[id]}
                  // onClick={() => toggleDisabled(id)}
                  className='opacity-50 hover:opacity-80 transition-all scale-110'
                >
                  {deleted ? (
                    <Undo2 className='shrink-0' size={12} />
                  ) : (
                    <X className='shrink-0' size={12} />
                  )}
                </Button>
              </div>
            </div>
            <input type='hidden' name='quoteId' value={id} />
          </Form>
        )
      )}
    </div>
  )
}

export default BookPage
