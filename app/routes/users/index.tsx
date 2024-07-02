import UserPanel from '@/components/UserPanel'
import { getUsers } from '@/db/user.db'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

export const loader = async () => json(await getUsers())

export default function Index() {
  const users = useLoaderData<typeof loader>()

  return <UserPanel users={users} />
}
