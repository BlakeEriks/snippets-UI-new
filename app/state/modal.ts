import { Quote } from '@prisma/client'
import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

const activeModalAtom = atom<null | string>(null)

const modalPropsAtom = atom<Partial<Quote>>({})

export const modalStateAtom = atomFamily((modalId: string) =>
  atom(
    get => (get(activeModalAtom) === modalId ? get(modalPropsAtom) : null),
    (_get, set, state: any) => {
      if (state) {
        set(activeModalAtom, modalId)
        set(modalPropsAtom, state)
      } else {
        set(activeModalAtom, null)
        set(modalPropsAtom, {})
      }
    }
  )
)
