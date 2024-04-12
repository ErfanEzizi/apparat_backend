import { Hono } from 'hono'

const posts = new Hono()

posts.get('/', (c) => {
  return c.text("Post working");
});

export default posts