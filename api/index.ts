import { Hono } from 'hono'
import { cors } from 'hono/cors';
import { handle } from "hono/vercel";
import { Routes }  from '../src/routes/index'

const app = new Hono()
const port = process.env['PORT'] || 4400; // => "secret"

app.use(
    '*', // Apply to all routes     
    cors({
      origin: 'http://localhost:5173',
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    })
  );

app.route('/', Routes.home)
app.route('/jobs', Routes.jobs)
app.route('/users', Routes.users)

console.log(`\n All is well on port ${port}`)

export default handle(app)
