import { Hono } from 'hono'
import { Routes } from './routes/index'

const app = new Hono()

app.route('/', Routes.home)
app.route('/posts', Routes.posts)
app.route('/users', Routes.users)

console.log(`\n All is well on port ${3000}`)

export default app
