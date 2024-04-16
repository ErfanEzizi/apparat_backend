import { PrismaClient } from '@prisma/client'
import { UserSchema, UserType } from './types'
import { z } from 'zod'

const prisma = new PrismaClient()

export const getAllUsers = async () => {
  try {
    const allUsers = await prisma.user.findMany()

    return allUsers
  } catch (e) {
    console.log(e)

    throw e
  }
}

export const createUser = async (data: z.infer<typeof UserSchema>) => {
  try {
    const createUser = await prisma.user.create({ data: data })

    return createUser
  } catch (e) {
    console.log(e)

    throw e
  }
}

export const deleteUser = async (id: UserType['id']) => {
  try {
    const deleteUser = await prisma.user.delete({
      where: {
        id: id,
      },
    })
    return deleteUser
  } catch (e) {
    console.log(e)

    throw e
  }
}
