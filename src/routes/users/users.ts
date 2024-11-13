import { Hono } from 'hono'
import { create_user, delete_user, find_user_by_email, get_all_users, update_user_record } from './service'
import { zValidator } from '@hono/zod-validator'
import { CreateUserSchema, UpdateUserSchema } from './types'
import { jwt, sign } from 'hono/jwt';

const users = new Hono()

const JWT_SECRET = process.env['JWT_SECRET']!;

const authenticate = jwt({ secret: JWT_SECRET });

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
      return c.json({ err: result.error.issues, ok: false }, 400)
    }
  }),
  async c => {
    try {
      const body = c.req.valid('json')
      const newUser = await create_user(body)

      return c.json({ data: newUser, ok: true }, 201)
    } catch (e: any) {
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
    const body = c.req.valid('json')
    const result = await update_user_record(id, body)

    return c.json({data: result, ok: true}, 200)
  } catch (e) {

    return c.json({err: e, ok: false}, 500)
  }
})

// User login route to issue a JWT
users.post('/login', async (c) => {
  const { email, password } = await c.req.json();

  try {
    const user = await find_user_by_email(email);
    if (!user) {
      return c.json({ message: 'Invalid email or password', ok: false }, 401);
    }

    // Validate password
    const isPasswordCorrect = await Bun.password.verify(password, user.password);
    if (!isPasswordCorrect) {
      return c.json({ message: 'Invalid email or password', ok: false }, 401);
    }

    const payload = {
      id: user.id,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60
    }

    // Generate JWT
    const token = await sign(payload, JWT_SECRET);

    return c.json({ token, ok: true }, 200);
  } catch (e: any) {
    return c.json({ error: e.message, ok: false }, 500);
  }
});

export default users
