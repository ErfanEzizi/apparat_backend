import { z } from 'zod'

const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
)

export const UserSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().regex(passwordValidation, {
    message:
      'Password must contain min 8 characters, one uppercase, lowercase, number, and special character',
  }),
})

export interface UserType extends z.infer<typeof UserSchema> {
  id: string
  role: Role
}

export enum Role {
  CLIENT,
  CREATOR,
}
