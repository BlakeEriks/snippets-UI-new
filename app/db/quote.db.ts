import { Book, Prisma, Quote } from '@prisma/client'
import { find, map } from 'lodash'
import prisma from './client.db'

export const saveSnippetsDotTxt = async (quotes: Quote[]) => {
  const allBooks = await prisma.book.findMany()
  const sourceStrings = new Set<string>(map(quotes, 'source') as string[])
  const allQuotesCreatedAts = new Set(
    map(await prisma.quote.findMany(), ({ createdAt }) => createdAt.toISOString())
  )

  // Create books from source strings if they don't yet exist
  for (const sourceString of Array.from(sourceStrings)) {
    if (allBooks.find(({ source }) => source === sourceString)) continue

    // TODO pull out this parsing logic
    // ex The 7 Habits of Highly Effective People (Covey, Stephen R.)
    const [title, author] = sourceString.split(' (')
    let authorName = author.replace(')', '') // Covey, Stephen R.
    if (authorName.includes(', ')) {
      authorName = authorName.split(', ').reverse().join(' ') // Covey, Stephen R. => Covey, Stephen R. => Stephen R. Covey
    }
    const book = await prisma.book.create({
      data: {
        source: sourceString,
        title,
        author: {
          connectOrCreate: {
            create: {
              name: authorName,
            },
            where: {
              name: authorName,
            },
          },
        },
      },
    })
    allBooks.push(book)
  }

  const savedQuotes = quotes
    .filter(({ createdAt }) => !allQuotesCreatedAts.has(createdAt.toISOString()))
    .map(({ createdAt, meta, content, source, user }: any): Prisma.QuoteCreateInput => {
      const { id } = find(allBooks, { source }) as Book

      return {
        createdAt: new Date(createdAt),
        meta,
        content,
        user: {
          connect: {
            id: user.id,
          },
        },
        book: {
          connect: {
            id,
          },
        },
      }
    })

  const results: Quote[] = []
  for (const data of savedQuotes) {
    results.push(await prisma.quote.create({ data }))
  }
  return results.filter(Boolean)
}

export const toggleFavorite = async (quoteId: number, userId: number) => {
  const favorite = await prisma.userFavorite.findUnique({
    where: {
      userId_quoteId: {
        quoteId,
        userId,
      },
    },
  })

  if (favorite) {
    return await addFavorite(quoteId, userId)
  }
  return await removeFavorite(quoteId, userId)
}

const removeFavorite = async (quoteId: number, userId: number) =>
  prisma.userFavorite.delete({
    where: {
      userId_quoteId: {
        quoteId,
        userId,
      },
    },
  })

const addFavorite = async (quoteId: number, userId: number) =>
  prisma.userFavorite.create({
    data: {
      quoteId,
      userId,
    },
  })
