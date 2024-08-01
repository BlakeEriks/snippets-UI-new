import { Books } from '@/db/book.db'
import { Form } from '@remix-run/react'
import { Controller } from 'react-hook-form'
import { useRemixForm } from 'remix-hook-form'
import { z } from 'zod'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'

export const QuoteSchema = z.object({
  content: z.string().min(2, {
    message: 'Quote content must be at least 2 characters.',
  }),
  quotee: z
    .string()
    .min(2, { message: 'Quotee must be at least 2 characters.' })
    .nullable()
    .or(z.literal('')),
  bookId: z
    .number({
      required_error: 'Please select a book',
      invalid_type_error: 'Book ID must be a number',
    })
    .int()
    .nullable(),
})

export type QuoteFormData = z.infer<typeof QuoteSchema>

const QuoteForm = ({ quote, books }: { quote?: QuoteFormData; books: Books }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useRemixForm<QuoteFormData>({
    mode: 'onSubmit',
    defaultValues: {
      content: quote?.content,
      quotee: quote?.quotee ?? '',
      bookId: quote?.bookId ?? null,
    },
  })

  return (
    <Form id='quote-form' method='post' onSubmit={handleSubmit} className='space-y-4'>
      <Label>
        Content:
        <Textarea {...register('content')} rows={12} className='h-48' />
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
    </Form>
  )
}

export default QuoteForm
