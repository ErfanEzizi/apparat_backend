import { z } from 'zod'

const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
)

const Role = z.enum(["CLIENT", "CREATOR"])

export const CreateUserSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().regex(passwordValidation, {
    message:
      'Password must contain min 8 characters, one uppercase, lowercase, number, and special character',
  }),
  role: Role.default("CLIENT")
})

export const UpdateUserSchema = z.object({
  username: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().regex(passwordValidation, {
    message:
      'Password must contain min 8 characters, one uppercase, lowercase, number, and special character',
  }).optional(), 
  role: Role.optional(),
}).strict();

export interface UserType extends z.infer<typeof CreateUserSchema> {
  id: string;
}

