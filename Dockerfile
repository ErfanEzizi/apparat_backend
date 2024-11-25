# Use the Bun base image
FROM oven/bun:latest

# Set the working directory inside the container
WORKDIR /app

# Copy necessary files into the container
COPY package.json bun.lockb ./
COPY prisma ./prisma/
COPY src ./src
COPY .env .env

# Install dependencies
RUN bun install
RUN bunx prisma generate
RUN bunx prisma migrate deploy

# Expose the port your app listens on
EXPOSE 3000

# Start the app using the correct entry point
CMD ["bun", "run", "src/index.ts"]