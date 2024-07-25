import { User } from '@prisma/client'
import { Form, Link, useSearchParams } from '@remix-run/react'
import { useSetAtom } from 'jotai'
import _ from 'lodash'
import { useNavigate } from 'react-router-dom'
import { useRemixForm } from 'remix-hook-form'
import userAtom from '../state/user'
import { Button } from './ui/button'

type UserPanelProps = {
  users: User[]
}

const UserPanel = ({ users }: UserPanelProps) => {
  const setUser = useSetAtom(userAtom)
  const navigate = useNavigate()
  const [params, setSearchParams] = useSearchParams()

  const selectUser = (id: number) => {
    const user = _.find(users, { id })
    if (user) {
      setUser(user)
      navigate('/books')
    }
  }

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useRemixForm<Partial<User>>({
    mode: 'onSubmit',
  })

  return (
    <div className='m-[10%]'>
      <h1 className='text-2xl text-center my-6'>Whos Using Quotes?</h1>
      <div className='flex justify-center'>
        <Form method='post'>
          {users.map(({ name, id }: User) => (
            <Button
              key={id}
              className='text-center w-32 mx-2 py-12 border border-slate-300 rounded-3xl hover:shadow-lg transition-shadow cursor-pointer'
              onClick={() => selectUser(id)}
            >
              {name}
            </Button>
          ))}
        </Form>
        <Link to='./new'>+</Link>
        {/* <Dialog
          onOpenChange={open => {
            reset()
            setSearchParams(open ? { newUser: 'true' } : {})
          }}
          open={!!params.get('newUser')}
        >
          <DialogTrigger asChild>
            <Button
              variant='outline'
              className='text-center w-32 mx-2 py-12 border border-slate-300 rounded-3xl hover:shadow-lg transition-shadow cursor-pointer'
            >
              +
            </Button>
          </DialogTrigger>
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
        </Dialog> */}
      </div>
    </div>
  )
}

export default UserPanel
