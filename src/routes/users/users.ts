import { Hono } from 'hono'
import { createUser, deleteUser, getAllUsers } from './service'
import { zValidator } from '@hono/zod-validator'
import { UserSchema, UserType } from './types'

const users = new Hono()

// Get all existing Users
users.get('/', async c => {
  const allUsers = await getAllUsers()

  return c.json({ users: allUsers, ok: true }, 200)
})

//Create new User record
users.post(
  '/',
  zValidator('json', UserSchema, (result, c) => {
    if (!result.success) {
      return c.json({ err: result.error, ok: false }, 400)
    }
  }),
  async c => {
    try {
      const body = await c.req.valid('json')
      const newUser = await createUser(body)

      return c.json({ data: newUser, ok: true }, 201)
    } catch (e) {
      return c.json({ error: e, ok: false }, 500)
    }
  },
)

//Delete a selected User record with :id param
users.delete('/:id', async c => {
  const { id } = c.req.param()
  try {
    const result = await deleteUser(id)

    return c.json({ deleted: result, ok: true }, 200)
  } catch (e) {
    return c.json({ error: e, ok: false }, 500)
  }
})

export default users
