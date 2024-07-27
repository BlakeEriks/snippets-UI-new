import { Book, Prisma, Quote } from '@prisma/client'
import _ from 'lodash'
import prisma from './client.db'

export const saveSnippetsDotTxt = async (quotes: Quote[]) => {
  const allBooks = await prisma.book.findMany()
  const sourceStrings = new Set<string>(_.map(quotes, 'source') as string[])
  const allQuotesCreatedAts = new Set(
    _.map(await prisma.quote.findMany(), ({ createdAt }) => createdAt.toISOString())
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
      const { id } = _.find(allBooks, { source }) as Book

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

export const getFavorites = (userId: number) =>
  prisma.userFavorite
    .findMany({
      select: {
        quoteId: true,
      },
      where: {
        userId,
      },
    })
    .then(favorites => _.map(favorites, 'quoteId'))

export const toggleFavorite = async (userId: number, quoteId: number) => {
  const favorite = await prisma.userFavorite.findUnique({
    where: {
      userId_quoteId: {
        userId,
        quoteId,
      },
    },
  })

  const method = favorite ? removeFavorite : addFavorite

  return method(userId, quoteId)
}

const removeFavorite = async (userId: number, quoteId: number) =>
  prisma.userFavorite.delete({
    where: {
      userId_quoteId: {
        userId,
        quoteId,
      },
    },
  })

const addFavorite = async (userId: number, quoteId: number) =>
  prisma.userFavorite.create({
    data: {
      userId,
      quoteId,
    },
  })
