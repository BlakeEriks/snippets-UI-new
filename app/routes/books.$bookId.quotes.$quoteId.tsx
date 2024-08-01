import QuoteForm, { QuoteFormData, QuoteSchema } from '@/components/QuoteForm'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getBooks } from '@/db/book.db'
import { saveQuote } from '@/db/quote.db'
import { requireUserId } from '@/session.server'
import { superjson, useSuperLoaderData } from '@/utils/data'
import { zodResolver } from '@hookform/resolvers/zod'
import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node'
import { useNavigate } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import { redirectWithSuccess } from 'remix-toast'

export const action = async ({ request, params: { quoteId } }: ActionFunctionArgs) => {
  const userId = await requireUserId(request)
  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<QuoteFormData>(request, zodResolver(QuoteSchema))

  if (errors) {
    return superjson({ errors, defaultValues })
  }

  try {
    const quote = await saveQuote({ ...data, userId, id: Number(quoteId) })
    return redirectWithSuccess(`/books/${quote.bookId}`, { message: 'Quote updated!' })
  } catch (error) {
    return json({ errorMessage: 'Failed to save quote' }, { status: 400 })
  }
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request)
  const { bookId, quoteId } = params

  const books = await getBooks(userId)
  const book = books.find(book => book.id === Number(bookId))
  if (!book) throw new Response('Book Not Found', { status: 404 })

  const quote = book.quotes.find(quote => quote.id === Number(quoteId))
  if (!quote) throw new Response('Quote Not Found', { status: 404 })

  return superjson({ books, quote })
}

const EditQuoteRoute = () => {
  const { books, quote } = useSuperLoaderData<typeof loader>()
  const navigate = useNavigate()

  return (
    <Dialog open={true} onOpenChange={() => navigate(-1)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Quote</DialogTitle>
          <DialogDescription>Update the details of the quote below.</DialogDescription>
        </DialogHeader>
        <QuoteForm quote={quote} books={books} />
        <DialogFooter>
          <Button form='quote-form'>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditQuoteRoute
