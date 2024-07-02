// import { Book, Prisma, Quote } from '@prisma/client'
// import { find, map } from 'lodash'
// import prisma from './client.db'

// export const saveSnippetsDotTxt = async (books: Book[]) => {
//   const allBooks = await prisma.book.findMany()
//   const sourceStrings = new Set<string>(map(books, 'source') as string[])
//   const allQuotesCreatedAts = new Set(
//     map(await prisma.quote.findMany(), ({ createdAt }) => createdAt.toISOString())
//   )

//   // Create books from source strings if they don't yet exist
//   for (const sourceString of Array.from(sourceStrings)) {
//     if (allBooks.find(({ source }) => source === sourceString)) continue

//     // TODO pull out this parsing logic
//     // ex The 7 Habits of Highly Effective People (Covey, Stephen R.)
//     const [title, author] = sourceString.split(' (')
//     let authorName = author.replace(')', '') // Covey, Stephen R.
//     if (authorName.includes(', ')) {
//       authorName = authorName.split(', ').reverse().join(' ') // Covey, Stephen R. => Covey, Stephen R. => Stephen R. Covey
//     }
//     const book = await prisma.book.create({
//       data: {
//         source: sourceString,
//         title,
//         author: {
//           connectOrCreate: {
//             create: {
//               name: authorName,
//             },
//             where: {
//               name: authorName,
//             },
//           },
//         },
//       },
//     })
//     allBooks.push(book)
//   }

//   const quotes = books
//     .filter(({ createdAt }: any) => !allQuotesCreatedAts.has(createdAt))
//     .map(({ createdAt, meta, content, source, user }: any): Prisma.QuoteCreateInput => {
//       let { id } = find(allBooks, { source })!

//       return {
//         createdAt: new Date(createdAt),
//         meta,
//         content,
//         user: {
//           connect: {
//             id: user.id,
//           },
//         },
//         book: {
//           connect: {
//             id,
//           },
//         },
//       }
//     })

//   const results: Quote[] = []
//   for (const data of quotes) {
//     results.push(await prisma.quote.create({ data }))
//   }
//   return results.filter(Boolean)
// }
