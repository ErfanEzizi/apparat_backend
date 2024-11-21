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

export const updateJobApplicationStatus = async (applicationId: string, status: "accepted" | "declined") => {
  if (!applicationId || !status) {
    throw new Error("Application ID and status are required");
  }

  const updatedApplication = await prisma.jobApplication.update({
    where: { id: applicationId },
    data: { status },
  });

  // If the application is accepted, update the job's status
  if (status === "accepted") {
    await prisma.job.update({
      where: { id: updatedApplication.jobId },
      data: { status: "accepted" },
    });
  }

  return updatedApplication;
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

export const apply_to_job = async (jobId: string, photographerId: string) => {
  try {
    // Check if the photographer has already applied
    const existingApplication = await prisma.jobApplication.findFirst({
      where: { jobId, photographerId },
    });

    if (existingApplication) {
      throw new Error("You have already applied for this job.");
    }

    // Create a new application
    const application = await prisma.jobApplication.create({
      data: { jobId, photographerId },
    });

    return application;
  } catch (e: any) {
    console.error("Error applying to job:", e);
    throw new Error(e.message || "Failed to apply to job.");
  }
};

// Get all applications for a job
export const get_job_applications = async (jobId: string) => {
  try {
    const applications = await prisma.jobApplication.findMany({
      where: { jobId },
      include: { photographer: true }, // Include photographer details
    });

    return applications;
  } catch (e) {
    console.error("Error fetching job applications:", e);
    throw new Error("Failed to fetch job applications.");
  }
};

// Assign a photographer to a job
export const assign_photographer = async (jobId: string, photographerId: string) => {
  try {
    // Update the job's creatorId field
    const job = await prisma.job.update({
      where: { id: jobId },
      data: { creatorId: photographerId, status: "accepted" },
    });

    // Update the selected application status to "accepted"
    await prisma.jobApplication.updateMany({
      where: { jobId, photographerId },
      data: { status: "accepted" },
    });

    // Mark all other applications as "rejected"
    await prisma.jobApplication.updateMany({
      where: { jobId, photographerId: { not: photographerId } },
      data: { status: "rejected" },
    });

    return job;
  } catch (e) {
    console.error("Error assigning photographer to job:", e);
    throw new Error("Failed to assign photographer.");
  }
};