import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { getBooks } from '@/db/book.db'
import { saveQuote } from '@/db/quote.db'
import { requireUserId } from '@/session.server'
import { zodResolver } from '@hookform/resolvers/zod'
import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node'
import { Form, useLoaderData, useNavigate } from '@remix-run/react'
import { Controller } from 'react-hook-form'
import { getValidatedFormData, useRemixForm } from 'remix-hook-form'
import { redirectWithSuccess } from 'remix-toast'
import { z } from 'zod'

const QuoteSchema = z.object({
  content: z.string().min(2, {
    message: 'Quote content must be at least 2 characters.',
  }),
  quotee: z
    .string()
    .min(2, { message: 'Quotee must be at least 2 characters.' })
    .optional()
    .or(z.literal('')),
  bookId: z
    .number({
      required_error: 'Please select a book',
      invalid_type_error: 'Book ID must be a number',
    })
    .int(),
})

type QuoteFormData = z.infer<typeof QuoteSchema>

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const userId = await requireUserId(request)
  const quoteId = Number(params.quoteId)
  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<QuoteFormData>(request, zodResolver(QuoteSchema))

  if (errors) {
    return json({ errors, defaultValues })
  }

  try {
    const quote = await saveQuote({ ...data, userId, id: quoteId })
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

  return json({ books, quote })
}

const EditQuoteRoute = () => {
  const { books, quote } = useLoaderData<typeof loader>()
  const navigate = useNavigate()

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useRemixForm<QuoteFormData>({
    mode: 'onSubmit',
    defaultValues: {
      content: quote.content,
      quotee: quote.quotee ?? '',
      bookId: quote.bookId ?? undefined,
    },
  })

  return (
    <Dialog open={true} onOpenChange={() => navigate(-1)}>
      <DialogContent>
        <Form method='post' onSubmit={handleSubmit} className='space-y-4'>
          <DialogHeader>
            <DialogTitle>Edit Quote</DialogTitle>
            <DialogDescription>Update the details of the quote below.</DialogDescription>
          </DialogHeader>
          <Label>
            Content:
            <Textarea {...register('content')} className='h-48' />
            {errors.content && <p className='text-red-500'>{errors.content.message}</p>}
          </Label>
          <Label>
            Quotee:
            <Input type='text' {...register('quotee')} />
            {errors.quotee && <p className='text-red-500'>{errors.quotee.message}</p>}
          </Label>
          <Label>
            Book:
            <Controller
              name='bookId'
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={String(field.value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {books?.map(book => (
                      <SelectItem key={book.id} value={String(book.id)}>
                        {book.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.bookId && <p className='text-red-500'>{errors.bookId.message}</p>}
          </Label>
          <DialogFooter>
            <Button>Save</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditQuoteRoute
