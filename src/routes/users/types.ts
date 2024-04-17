import { z } from 'zod'

const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
)
export enum Role {
  CLIENT = 'CLIENT',
  CREATOR = 'CREATOR',
}

export const CreateUserSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().regex(passwordValidation, {
    message:
      'Password must contain min 8 characters, one uppercase, lowercase, number, and special character',
  }),
})

export const UpdateUserSchema = z.object({
  username: z.string().optional(), // Make optional if applicable
  email: z.string().email().optional(), // Make optional if applicable
  password: z.string().regex(passwordValidation, {
    message:
      'Password must contain min 8 characters, one uppercase, lowercase, number, and special character',
  }).optional(), // Make optional for update
  role: z.enum([Role.CLIENT, Role.CREATOR]).optional(), // Make optional for update
}).strict(); // Enable strict mode

export interface UserType extends z.infer<typeof CreateUserSchema> {
  id: string;
  role: Role;
}

