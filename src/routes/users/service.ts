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

// Fetch all applications for a specific user
export const getUserApplications = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  return await prisma.jobApplication.findMany({
    where: {
      id: userId,
    },
    include: {
      job: true, // Include related job details
    },
  });
};

export const getClientJobsWithApplicants = async (clientId: string) => {
  if (!clientId) {
    throw new Error("Client ID is required");
  }

  return await prisma.job.findMany({
    where: {
      clientId,
    },
    include: {
      jobApplications: {
        include: {
          photographer: true, // Include user (applicant) details
        },
      },
    },
  });
};

export const changeUserPassword = async (userId: string, currentPassword: string, newPassword: string) => {
  if (!userId || !currentPassword || !newPassword) {
    throw new Error("User ID, current password, and new password are required");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await Bun.password.verify(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  const hashedPassword = await Bun.password.hash(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: "Password updated successfully" };
};
