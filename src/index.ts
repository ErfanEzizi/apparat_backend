import { Hono } from 'hono'
import { Routes }  from './routes/index'

const app = new Hono()
const port = process.env['PORT'] || 4400; // => "secret"

app.route('/', Routes.home)
app.route('/jobs', Routes.jobs)
app.route('/users', Routes.users)

console.log(`\n All is well on port ${port}`)

export default app
