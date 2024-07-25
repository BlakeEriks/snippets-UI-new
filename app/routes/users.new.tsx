import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createUser } from '@/db/user.db'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@prisma/client'
import { ActionFunctionArgs, json } from '@remix-run/node'
import { Form, useNavigate } from '@remix-run/react'
import { getValidatedFormData, useRemixForm } from 'remix-hook-form'
import { redirectWithSuccess } from 'remix-toast'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
})

type FormData = z.infer<typeof schema>

const resolver = zodResolver(schema)

export const action = async ({ request }: ActionFunctionArgs) => {
  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, resolver)

  if (errors) {
    return json({ errors, defaultValues })
  }

  try {
    await createUser(data)
    return redirectWithSuccess('/users', { message: 'User created!' })
  } catch (error) {
    return json({ errorMessage: 'Failed to create user' }, { status: 400 })
  }
}

const NewUserRoute = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useRemixForm<Partial<User>>({
    mode: 'onSubmit',
  })
  const navigate = useNavigate()

  return (
    <Dialog onOpenChange={() => navigate('/users')} open={true}>
      <DialogContent>
        <Form method='post' onSubmit={handleSubmit} className='space-y-4'>
          <DialogHeader>
            <DialogTitle>New User</DialogTitle>
          </DialogHeader>
          <Label>
            Name:
            <Input type='text' {...register('name')} />
            {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
          </Label>
          <DialogFooter>
            <Button type='submit'>Save changes</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default NewUserRoute
