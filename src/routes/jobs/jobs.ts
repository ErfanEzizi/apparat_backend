import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  get_all_jobs,
  get_job_by_id,
  create_job,
  update_job,
  delete_job,
} from "./service";
import { CreateJobSchema, UpdateJobSchema } from "./validations";

const jobs = new Hono();

// Get all jobs
jobs.get("/", async (c) => {
  try {
    const allJobs = await get_all_jobs();
    return c.json({ jobs: allJobs, ok: true }, 200);
  } catch (e: any) {
    return c.json({ error: e.message, ok: false }, 500);
  }
});

// Get a single job by ID
jobs.get("/:id", async (c) => {
  const { id } = c.req.param();
  try {
    const job = await get_job_by_id(id);
    return c.json({ job, ok: true }, 200);
  } catch (e: any) {
    return c.json({ error: e.message, ok: false }, 404);
  }
});

// Create a new job
jobs.post(
  "/",
  zValidator("json", CreateJobSchema, (result, c) => {
    if (!result.success) {
      return c.json({ err: result.error.issues, ok: false }, 400);
    }
  }),
  async (c) => {
    const body = c.req.valid("json");
    try {
      const newJob = await create_job(body);
      return c.json({ job: newJob, ok: true }, 201);
    } catch (e: any) {
      return c.json({ error: e.message, ok: false }, 500);
    }
  }
);

// Update an existing job
jobs.put(
  "/:id",
  zValidator("json", UpdateJobSchema, (result, c) => {
    if (!result.success) {
      return c.json({ err: result.error.issues, ok: false }, 400);
    }
  }),
  async (c) => {
    const { id } = c.req.param();
    const body = c.req.valid("json");
    try {
      const updatedJob = await update_job(id, body);
      return c.json({ job: updatedJob, ok: true }, 200);
    } catch (e: any) {
      return c.json({ error: e.message, ok: false }, 500);
    }
  }
);

// Delete a job
jobs.delete("/:id", async (c) => {
  const { id } = c.req.param();
  try {
    const deletedJob = await delete_job(id);
    return c.json({ job: deletedJob, ok: true }, 200);
  } catch (e: any) {
    return c.json({ error: e.message, ok: false }, 500);
  }
});

export default jobs;
