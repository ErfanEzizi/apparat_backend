# **2-Week Daily Task Plan for MVP**

## **Week 1: Backend Development and Database Setup**

### **Day 1: Initialize Backend and Database**
- [ ] Finalize Prisma schema.
- [ ] Run migrations to create database tables.
- [ ] Set up the project structure for the backend.

### **Day 2: Authentication Setup**
- [ ] Implement user registration with hashed passwords.
- [ ] Implement JWT-based login route.
- [ ] Test login and signup endpoints.

### **Day 3: CRUD Operations for Jobs**
- [ ] Add endpoints for creating, reading, updating, and deleting job postings.
- [ ] Write basic validation for job data.

### **Day 4: Booking and Relations**
- [ ] Create endpoints for assigning jobs to photographers.
- [ ] Ensure relations between `User` and `Booking` models work correctly.

### **Day 5: Error Handling and Testing**
- [ ] Add error handling for all routes (e.g., validation, 404 errors).
- [ ] Write minimal unit tests for key endpoints (e.g., authentication, job posting).

### **Day 6: Seed the Database**
- [ ] Write a `seed` script to populate the database with mock data (users, jobs, bookings).
- [ ] Use Prisma Studio to verify data integrity.

### **Day 7: Backend Testing**
- [ ] Test the entire backend thoroughly using Postman or a similar tool.
- [ ] Fix any issues or bugs found during testing.

---

## **Week 2: Frontend and Presentation**

### **Day 8: Frontend Initialization**
- [ ] Set up the frontend project using a framework (e.g., React).
- [ ] Create pages for user signup and login.

### **Day 9: Job Posting Page**
- [ ] Create a page for job posting (for clients).
- [ ] Connect frontend to the backend for job creation.

### **Day 10: Job Listing and Acceptance**
- [ ] Create a page for photographers to browse and accept jobs.
- [ ] Implement the job acceptance functionality on the frontend.

### **Day 11: Basic UI Design**
- [ ] Add minimal styling using a framework (e.g., Tailwind CSS).
- [ ] Ensure the app looks presentable and user-friendly.

### **Day 12: Simulated Geolocation**
- [ ] Add a simulated geolocation feature (e.g., static location updates).
- [ ] Create a basic map to showcase photographer movement.

### **Day 13: Full Testing**
- [ ] Test the entire app flow (signup → job posting → job acceptance).
- [ ] Fix any UI or backend issues identified.

### **Day 14: Demo Preparation**
- [ ] Prepare mock data for the demo.
- [ ] Create a walkthrough or record a video showcasing the app’s functionality.

---

## **Notes**
- Focus on **core features**: Authentication, job posting, and acceptance.
- Skip advanced features (e.g., messaging or real-time location) unless you have extra time.
- Test thoroughly to ensure a smooth presentation to investors.
