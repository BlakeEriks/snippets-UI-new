import { User } from '@prisma/client'
import { atomWithStorage } from 'jotai/utils'

const userAtom = atomWithStorage<User | undefined>('activeUser', undefined)

export default userAtom
