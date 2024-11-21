import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  get_all_jobs,
  get_job_by_id,
  create_job,
  update_job,
  delete_job,
  apply_to_job,
  get_job_applications,
  assign_photographer,
  updateJobApplicationStatus,
} from "./service";
import { AssignPhotographerSchema, CreateJobSchema, JobApplicationSchema, UpdateJobSchema } from "./validations";

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

jobs.put("/:id/application-status", async (c) => {
  const { id: applicationId } = c.req.param();
  const { status } = await c.req.json();

  if (!["accepted", "declined"].includes(status)) {
    return c.json({ error: "Invalid status value" }, 400);
  }

  try {
    const updatedApplication = await updateJobApplicationStatus(applicationId, status);
    return c.json({ application: updatedApplication, ok: true }, 200);
  } catch (error: any) {
    return c.json({ error: error.message, ok: false }, 500);
  }
});

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

// Photographer applies to a job
jobs.post(
  "/:id/apply",
  zValidator("json", JobApplicationSchema, (result, c) => {
    if (!result.success) {
      return c.json({ err: result.error.issues, ok: false }, 400);
    }
  }),
  async (c) => {
    const { id: jobId } = c.req.param();
    const { photographerId } = c.req.valid("json");

    try {
      const application = await apply_to_job(jobId, photographerId);
      return c.json({ application, ok: true }, 201);
    } catch (e: any) {
      return c.json({ error: e.message, ok: false }, 400);
    }
  }
);

// Get all applications for a job
jobs.get("/:id/applications", async (c) => {
  const { id: jobId } = c.req.param();

  try {
    const applications = await get_job_applications(jobId);
    return c.json({ applications, ok: true }, 200);
  } catch (e: any) {
    return c.json({ error: e.message, ok: false }, 500);
  }
});

// Assign a photographer to a job
jobs.post(
  "/:id/assign",
  zValidator("json", AssignPhotographerSchema, (result, c) => {
    if (!result.success) {
      return c.json({ err: result.error.issues, ok: false }, 400);
    }
  }),
  async (c) => {
    const { id: jobId } = c.req.param();
    const { photographerId } = c.req.valid("json");

    try {
      const job = await assign_photographer(jobId, photographerId);
      return c.json({ job, ok: true }, 200);
    } catch (e: any) {
      return c.json({ error: e.message, ok: false }, 400);
    }
  }
);
export default jobs;
