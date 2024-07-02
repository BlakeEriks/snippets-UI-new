// import { Prisma } from '@prisma/client'
// import { Form } from '@remix-run/react'
// import { CaseSensitiveIcon } from 'lucide-react'
// import { Input } from 'postcss'
// import { useForm } from 'react-hook-form'
// // import { Button } from '~/components/ui/button'
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogFooter,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogTrigger,
// // } from '~/components/ui/dialog'
// // import { titleCase } from '~/utils/stringUtils'
// import { FormField } from './ui/form'

// type EditBook = {
//   title: string
//   author: string
// }

// // type CreateUserDialogProps = {
// //   open: boolean
// //   onClose: () => void
// // }

// export const CreateUserDialog = () => {
//   // const { getBooks, saveBook } = useBookApi()
//   // const { saveAuthor } = useAuthorApi()
//   // const { data: books } = useQuery<Book[]>(['books'], getBooks)
//   // const [modalState, setModalState] = useAtom(modalStateAtom('editBook'))
//   // const book = books?.find(book => book.id === modalState?.bookId)

//   const form = useForm<Prisma.UserCreateInput>({
//     // resolver: zodResolver(FormSchema),
//     defaultValues: {
//       name: '',
//     },
//   })

//   const handleSubmit = (data: EditBook) => {
//     // if (book) {
//     //   saveBook({ ...book, ...data })
//     // } else {
//     //   saveAuthor(data.author).then(author => saveBook({ ...data, authorId: author.id }))
//     // }
//     // setModalState(null)
//   }

//   // useEffect(() => {
//   //   if (!book) return

//   //   form.reset({
//   //     title: book.title,
//   //     author: book.author.name,
//   //   })
//   // }, [book])

//   return (
//     <Dialog>
//       <DialogTrigger>Open</DialogTrigger>
//       <DialogContent className='sm:max-w-[425px] bg-white'>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(handleSubmit)} className='gap-2'>
//             <DialogHeader>
//               <DialogTitle>Edit Book</DialogTitle>
//             </DialogHeader>
//             <FormField
//               control={form.control}
//               name='title'
//               render={({ field }) => (
//                 <FormItem>
//                   <div className='flex items-center'>
//                     <FormLabel className='flex-1'>Title</FormLabel>
//                     <Button
//                       size='sm'
//                       className='h-6'
//                       type='button'
//                       onClick={() => form.setValue('title', titleCase(field.value))}
//                     >
//                       <CaseSensitiveIcon />
//                     </Button>
//                   </div>
//                   <FormControl>
//                     <Input {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name='author'
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Author</FormLabel>
//                   <FormControl>
//                     <Input {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <DialogFooter>
//               <Button type='submit'>Save</Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   )
// }
