import { Hono } from 'hono'
import { changeUserPassword, create_user, delete_user, find_user_by_email, get_all_users, getClientJobsWithApplicants, getUserApplications, update_user_record } from './service'
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

users.put("/:id/change-password", async (c) => {
  const userId = c.req.param("id");
  const { currentPassword, newPassword } = await c.req.json();

  if (!currentPassword || !newPassword) {
    return c.json({ error: "Current password and new password are required" }, 400);
  }

  try {
    const result = await changeUserPassword(userId, currentPassword, newPassword);
    return c.json({ message: result.message, ok: true }, 200);
  } catch (error: any) {
    return c.json({ error: error.message, ok: false }, 400);
  }
});

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

// Get all applications for a specific user
users.get("/:id/applications", authenticate, async (c) => {
  const userId = c.req.param("id"); // Extract user ID from route parameters
  if (!userId) {
    return c.json({ error: "User ID is required" }, 400);
  }
  try {
    const applications = await getUserApplications(userId);
    return c.json({ applications, ok: true }, 200);
  } catch (error: any) {
    return c.json({ error: error.message, ok: false }, 500);
  }
});

users.get("/:id/jobs-with-applicants", async (c) => {
  const clientId = c.req.param("id");

  try {
    const jobs = await getClientJobsWithApplicants(clientId);
    return c.json({ jobs, ok: true }, 200);
  } catch (error: any) {
    return c.json({ error: error.message, ok: false }, 500);
  }
});

export default users
