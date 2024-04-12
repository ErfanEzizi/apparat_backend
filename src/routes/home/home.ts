import { Hono } from "hono";
import { FetchEventLike } from "hono/types";

const home = new Hono();

home.get('/', (c) => {
  return c.text('Hello Hono')
})

export default home