import { Hono } from 'hono'
import { create_user, delete_user, get_all_users, update_user_record } from './service'
import { zValidator } from '@hono/zod-validator'
import { CreateUserSchema, UpdateUserSchema } from './types'

const users = new Hono()

// Get all existing Users
users.get('/', async c => {
  const allUsers = await get_all_users()

  return c.json({ users: allUsers, ok: true }, 200)
})

//Create new User record
users.post(
  '/',
  zValidator('json', CreateUserSchema, (result, c) => {
    if (!result.success) {
      return c.json({ err: result.error, ok: false }, 400)
    }
  }),
  async c => {
    try {
      const body = await c.req.valid('json')
      const newUser = await create_user(body)

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
    const result = await delete_user(id)

    return c.json({ deleted: result, ok: true }, 200)
  } catch (e) {
    return c.json({ error: e, ok: false }, 500)
  }
})

users.put('/:id',zValidator('json', UpdateUserSchema, (result, c) => {
  if (!result.success) {
    return c.json({ err: result.error, ok:false }, 400)
  }
}) , async c => {
  const { id } = c.req.param()
  console.log(id)
  try {
    const body = await c.req.valid('json')
    const result = await update_user_record(id, body)

    return c.json({data: result, ok: true}, 200)
  } catch (e) {

    return c.json({err: e, ok: false}, 500)
  }
})

export default users
