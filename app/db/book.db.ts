import prisma from './client.db'

export const getBooks = () =>
  prisma.book.findMany({
    include: {
      author: true,
      quotes: {
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
    orderBy: {
      quotes: {
        _count: 'desc',
      },
    },
  })
