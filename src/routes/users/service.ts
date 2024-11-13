import { PrismaClient } from '@prisma/client'
import { CreateUserSchema, UpdateUserSchema, type UserType } from './types'
import { z } from 'zod'

const prisma = new PrismaClient()

export const get_all_users = async () => {
  try {
    const allUsers = await prisma.user.findMany()

    return allUsers
  } catch (e) {
    console.log(e)

    throw e
  }
}

export const create_user = async (data: z.infer<typeof CreateUserSchema>) => {
  try {
    const hashedPassword = await Bun.password.hash(data.password); // Hash password
    const createUser = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    return createUser
  } catch (e) {
    console.log(e)

    throw e
  }
}

// Find a user by email (for login)
export const find_user_by_email = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (e) {
    console.error('Error finding user by email:', e);
    throw new Error('Failed to find user');
  }
};

export const delete_user = async (id: UserType['id']) => {
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

export const update_user_record = async (id: UserType['id'], data: z.infer<typeof UpdateUserSchema>) => {
  console.log(id)
  try {
    const update_user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        username: data.username || undefined,
        email: data.email || undefined,
        role: data.role || undefined
      }
    })

    return update_user
  } catch (e) {
    console.log(e)

    throw e
  }
}
