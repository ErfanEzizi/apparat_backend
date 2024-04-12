import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import { Users } from "./types";

const users = new Hono();
const prisma = new PrismaClient()

users.get('/', async (c) => {

  try {
    const allUsers = await prisma.user.findMany();
    console.log('ok')
    return c.json(allUsers);
  } catch (error) {
    
  }
})

users.post('/', async (c) => {
  try {

    const body = await c.req.json();
    const createUser = await prisma.user.create({data:body})
    
    return c.json({ post: createUser, ok: true }, 201)
  } catch (error) {
    
    return c.json({ error: error, ok: false }, 422)
  }
})

export default users