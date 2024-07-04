import UserPanel from '@/components/UserPanel'
import { createUser, getUsers } from '@/db/user.db'
import { zodResolver } from '@hookform/resolvers/zod'
import { ActionFunctionArgs, json } from '@remix-run/node' // or cloudflare/deno
import { redirect, useLoaderData } from '@remix-run/react'
import { getValidatedFormData } from 'remix-hook-form'
import * as Zod from 'zod'

export const loader = async () => json(await getUsers())

const schema = Zod.object({
  name: Zod.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
})
type FormData = Zod.infer<typeof schema>

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
    return redirect('/users')
  } catch (error) {
    return json({ errorMessage: 'Failed to create user' }, { status: 400 })
  }
}

export default function Index() {
  const users = useLoaderData<typeof loader>()

  return <UserPanel users={users} />
}
