import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create CLIENT users
  const clients = await prisma.user.createMany({
    data: [
      {
        username: "client_one",
        email: "client1@example.com",
        password: "hashedpassword1", // Replace with hashed password
        role: "CLIENT",
      },
      {
        username: "client_two",
        email: "client2@example.com",
        password: "hashedpassword2",
        role: "CLIENT",
      },
    ],
  });

  console.log("CLIENT users created");

  // Create CREATOR users
  const creators = await prisma.user.createMany({
    data: [
      {
        username: "photographer_one",
        email: "photographer1@example.com",
        password: "hashedpassword3",
        role: "CREATOR",
      },
      {
        username: "photographer_two",
        email: "photographer2@example.com",
        password: "hashedpassword4",
        role: "CREATOR",
      },
    ],
  });

  console.log("CREATOR users created");

  // Fetch users (for creating jobs and applications)
  const [client1, client2] = await prisma.user.findMany({ where: { role: "CLIENT" } });
  const [photographer1, photographer2] = await prisma.user.findMany({ where: { role: "CREATOR" } });

  // Create Jobs
  const jobs = [
    {
      title: "Wedding Photography",
      description: "Capture moments at an outdoor wedding ceremony.",
      date: new Date(),
      locationName: "Central Park",
      status: "pending",
      clientId: client1.id,
      latitude: 40.785091,
      longitude: -73.968285,
    },
    {
      title: "Corporate Headshots",
      description: "Take professional headshots for a small team.",
      date: new Date(),
      locationName: "Downtown Manhattan",
      status: "pending",
      clientId: client2.id,
      latitude: 40.712776,
      longitude: -74.005974,
    },
  ];
  
  for (const job of jobs) {
    await prisma.job.create({
      data: job,
    });
  }  

  console.log("Jobs created");

  // Fetch jobs for applications
  const jobList = await prisma.job.findMany();

  // Create Job Applications
  const applications = await prisma.jobApplication.createMany({
    data: [
      {
        jobId: jobList[0].id,
        photographerId: photographer1.id,
        status: "pending",
      },
      {
        jobId: jobList[0].id,
        photographerId: photographer2.id,
        status: "pending",
      },
      {
        jobId: jobList[1].id,
        photographerId: photographer1.id,
        status: "pending",
      },
    ],
  });

  console.log("Job applications created");

  console.log("Database seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
