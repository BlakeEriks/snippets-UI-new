import { createUser } from '@/db/user.db'
import { User } from '@prisma/client'
import { useAtom } from 'jotai'
import _ from 'lodash'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import userAtom from '../state/user'
import { Button } from './ui/button'

type UserPanelProps = {
  users: User[]
}

const UserPanel = ({ users }: UserPanelProps) => {
  // const { allUsers, createUser } = useUserApi()
  const [, setUser] = useAtom(userAtom)
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const onModalConfirm = async () => {
    if (!name) {
      return
    }
    await createUser({ name })
    setOpen(false)
  }

  const selectUser = (id: number) => {
    const user = _.find(users, { id })
    if (user) {
      setUser(user)
      navigate('/')
    }
  }

  return (
    <div className='m-[10%]'>
      <h1 className='text-2xl text-center my-6'>Whos Using Quotes?</h1>
      <div className='flex justify-center'>
        {users.map(({ name, id }: User) => (
          <Button
            key={id}
            className='text-center w-32 mx-2 py-12 border border-slate-300 rounded-3xl hover:shadow-lg transition-shadow cursor-pointer'
            onClick={() => selectUser(id)}
          >
            {name}
          </Button>
        ))}
        <Button
          className='text-center w-32 mx-2 py-12 border border-slate-300 rounded-3xl hover:shadow-lg transition-shadow cursor-pointer'
          onClick={() => setOpen(true)}
        >
          +
        </Button>
      </div>
      {/* <Modal
        title='New User'
        open={open}
        onOk={onModalConfirm}
        onCancel={() => setOpen(false)}
        okButtonProps={{ disabled: !name }}
      >
        <div className='flex items-center'>
          <div className='pr-2'>Name:</div>
          <Input value={name} onChange={({ target }) => setName(target.value)} />
        </div>
      </Modal> */}
    </div>
  )
}

export default UserPanel
