import prisma from './client.db'

export const getBooks = (userId: number) =>
  prisma.book
    .findMany({
      include: {
        author: true,
        quotes: {
          orderBy: {
            createdAt: 'asc',
          },
          where: {
            userId,
          },
        },
      },
      orderBy: {
        quotes: {
          _count: 'desc',
        },
      },
    })
    .then(books => books.filter(book => book.quotes.length > 0))

export type Books = Awaited<ReturnType<typeof getBooks>>
