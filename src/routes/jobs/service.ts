import { PrismaClient } from "@prisma/client";
import {type CreateJobType, type UpdateJobType } from "./validations";

const prisma = new PrismaClient();

// Get all jobs
export const get_all_jobs = async () => {
  try {
    const allJobs = await prisma.job.findMany();
    return allJobs;
  } catch (e) {
    console.error("Error fetching jobs:", e);
    throw new Error("Failed to fetch jobs");
  }
};

// Get a single job by ID
export const get_job_by_id = async (id: string) => {
  try {
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) {
      throw new Error("Job not found");
    }
    return job;
  } catch (e) {
    console.error("Error fetching job by ID:", e);
    throw new Error("Failed to fetch job");
  }
};

// Create a new job
export const create_job = async (data: CreateJobType) => {
  try {
    const newJob = await prisma.job.create({ data });
    return newJob;
  } catch (e) {
    console.error("Error creating job:", e);
    throw new Error("Failed to create job");
  }
};

// Update a job
export const update_job = async (id: string, data: UpdateJobType) => {
  try {
    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined, // Convert string date to Date object
      },
    });
    return updatedJob;
  } catch (e) {
    console.error("Error updating job:", e);
    throw new Error("Failed to update job");
  }
};

// Delete a job
export const delete_job = async (id: string) => {
  try {
    const deletedJob = await prisma.job.delete({ where: { id } });
    return deletedJob;
  } catch (e) {
    console.error("Error deleting job:", e);
    throw new Error("Failed to delete job");
  }
};
