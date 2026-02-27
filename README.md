# 🚀 Tier-2 Cloud Web Application – Task Manager App

## 📌 Project Overview

This project is a **Tier-2 Cloud Web Application** built with a focus on AWS Networking, Security, and Infrastructure Design.

Although the application is a simple **Task Manager (To-Do App)** that performs CRUD operations (Add, Update, Delete Tasks), the main goal of this project was to design and deploy a secure, production-like AWS architecture using proper networking principles.

This project demonstrates:
- VPC Architecture Design
- Public & Private Subnet Configuration
- Secure Database Deployment
- NAT Gateway & Internet Gateway Implementation
- Route Tables & Security Groups
- EC2 Deployment
- MySQL Database in Private Subnet

---

# 🛠 Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
 
### Database
- MySQL

### Cloud Platform
- Amazon Web Services (AWS)

---

# 🏗 Project Architecture

The application follows a secure 2-tier architecture:

1. **VPC Created**
2. **Public Subnet**
   - EC2 Instance (Frontend + Backend Hosted)
   - Internet Gateway Attached
3. **Private Subnet**
   - MySQL Database
   - No direct internet access
4. **NAT Gateway**
   - Allows private subnet to access internet securely (for updates/packages)
5. **Route Tables**
   - Public Route Table → Connected to Internet Gateway
   - Private Route Table → Connected to NAT Gateway
6. **Security Groups**
   - Controlled inbound/outbound traffic
7. **Proper Network Segmentation**

Architecture Flow:

User → Internet → Internet Gateway → EC2 (Public Subnet) → MySQL (Private Subnet)

---

# ☁️ AWS Services Used

- Amazon VPC
- Public Subnet
- Private Subnet
- Internet Gateway (IGW)
- NAT Gateway
- Route Tables
- Security Groups
- EC2 Instance
- MySQL Database (Self-managed inside private subnet)

---

# 🔐 Security Implementation

Security was the primary focus of this project. Below are the security measures implemented:

## 1️⃣ Network Isolation
- Database deployed inside a Private Subnet
- No public IP assigned to MySQL server

## 2️⃣ Controlled Internet Access
- Internet Gateway used only for Public Subnet
- NAT Gateway used for outbound internet access from Private Subnet

## 3️⃣ Security Groups
- Only required ports opened:
  - 22 (SSH – Restricted to specific IP)
  - 80 (HTTP)
  - 443 (HTTPS if configured)
  - 3306 (MySQL – Allowed only from EC2 Security Group)

## 4️⃣ Principle of Least Privilege
- Minimal ports exposed
- Restricted inbound rules

## 5️⃣ Route Table Segmentation
- Public and Private traffic properly separated

---

# 📸 Project Screenshots

 
---

### Web-App UI
![Screenshot 1](https://github.com/user-attachments/assets/a093f9fc-286e-44fe-94f9-0de0eb95e98a)

### EC2 Backend Server 
![Screenshot 2](https://github.com/user-attachments/assets/0db22f27-c58b-47bb-8d2d-015a9f178d66)

### Database showcase 
![Screenshot 3](https://github.com/user-attachments/assets/9ab209df-bdbe-497d-9793-5b4f9759798b)

### RDS
![Screenshot 4](https://github.com/user-attachments/assets/31919fd2-a5f7-4590-9e57-3b7703943eb9)

### VPC
![Screenshot 5](https://github.com/user-attachments/assets/3e418948-ee0b-44fc-8444-6dea3d2e5248)

### Subnet
![Screenshot 6](https://github.com/user-attachments/assets/1f094774-a525-468f-b0e4-5020b2d4cca8)

### Routes Tables 
![Screenshot 7](https://github.com/user-attachments/assets/2931fd84-f126-4949-9072-1703e70d0896)

### Internet Gateway
![Screenshot 8](https://github.com/user-attachments/assets/1f394372-2e32-4b12-ba1d-4cb5c400729f)

### NAT Gatway
![Screenshot 9](https://github.com/user-attachments/assets/971be248-a3c8-4836-a8e7-3f8672fff3f2)

### Instance 
![Screenshot 10](https://github.com/user-attachments/assets/84bc05d1-fb0a-4a4b-ba4f-d74eaeaca708)

### Security Group
![Screenshot 11](https://github.com/user-attachments/assets/3fbdea42-82fa-45d2-bf66-f4586a728245)

 
---

# 📂 Project Features

- Add Task
- Update Task
- Delete Task
- Store tasks in MySQL database
- Secure backend connectivity
- Cloud-based deployment

---

# 🚀 How to Run Locally

## 1️⃣ Clone Repository

- git clone https://github.com/Aryan8855/Cloud-Tier-2-WEB-APP-.git
- cd tier2-task-app

 # Install Dependency 

 - cd backend 
 - npm install

#  Run the Project 

 - npm run dev
 - copy the link paste to the browser 

 
