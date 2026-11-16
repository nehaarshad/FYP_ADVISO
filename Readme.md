<div align="center">

# 🎓 Adviso — An Academic Batch Advisory System

**Automating academic advising at Riphah International University**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?logo=mysql)](https://mysql.com/)
[![Sequelize](https://img.shields.io/badge/Sequelize-ORM-blue)](https://sequelize.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-black)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Academic-lightgrey)]()

**Final Year Project (FYP) · BSSE · Faculty of Computing · Riphah International University, Islamabad · Spring 2026**

[Project Overview](#-project-overview) · [Features](#-key-features) · [Tech Stack](#-technology-stack) · [Architecture](#-system-architecture) · [Getting Started](#-getting-started) · [Testing](#-testing-and-evaluation) · [Team](#-team)

</div>

---

## 📌 Project Overview

Academic advising at Riphah International University is currently **entirely manual**. Advisors must:

- Manually collect transcripts from Fiori
- Hand-calculate credits and CGPA
- Match students against degree roadmaps
- Cross-check course offerings and timetables
- Detect timetable clashes by hand

This leads to **incorrect registrations**, **delayed graduations**, and — critically — **complete loss of advisory history** when a batch advisor changes.

### 💡 Our Solution

**Adviso** is a centralized, intelligent academic advisory system that:

1. **Automates transcript processing** — Coordinator uploads session results, and the system automatically updates each student's transcript, CGPA, and category-wise credits.
2. **Generates intelligent course recommendations** — Based on CGPA limits, prerequisites, assigned roadmap, and real-time timetable clash detection.
3. **Preserves advisory history** — Every decision, note, and recommendation is permanently logged, surviving advisor transitions.
4. **Streamlines coordination** — One dashboard for coordinators, advisors, and students with role-based access control.

> **SDG Alignment:** SDG 4 — Quality Education

---

## ✨ Key Features

### 👤 For Students
- 📊 View personal profile, CGPA, and degree completion progress
- 📜 View auto-generated transcripts (category-wise, semester-wise)
- 🎯 Receive advisor-finalized course recommendations
- 🗺️ View assigned degree roadmap
- 📅 View batch timetable and meeting schedules
- 💬 Real-time chat with assigned batch advisor

### 👨‍🏫 For Batch Advisors
- 👥 Manage assigned batches (regular + irregular students)
- 🤖 Generate system recommendations (CGPA caps, prerequisites, clash detection, FYP eligibility)
- ✅ Finalize recommendations and notify students via email
- 📝 Maintain sticky notes and advisory decision logs
- 📆 Schedule batch meetings with automatic free-slot detection
- 🗣️ Participate in the **Faculty Recommendation Hub** (post issues, suggest solutions, vote)
- 💬 Chat with any assigned student

### 🏫 For Coordinators
- 🧑‍🎓 Register users (single or bulk Excel upload)
- 🗺️ Upload and assign degree roadmaps
- 📤 Upload sessional course offerings, timetables, and results
- 📚 Manage course catalog, programs, and degree guidelines
- 🎬 Manage supporting instructional videos
- 🔐 Manage user accounts and reset passwords

### 🔒 System-Wide
- **Role-Based Access Control (RBAC)** — Students cannot view other students' data
- **JWT Authentication** — Auto-logout after 30 minutes of inactivity
- **PWA / Offline Support** — Installable, with offline caching
- **Automated Reminders** — Email notifications 24 hrs and 1 hr before meetings

---

## 🛠️ Technology Stack

| Layer | Technologies |
|:---|:---|
| **Frontend** | Next.js (App Router), React, TypeScript, Tailwind CSS, Zustand, Framer Motion, next-pwa |
| **Backend** | Node.js, Express.js, JavaScript |
| **Database** | MySQL 8.0 + Sequelize ORM |
| **Authentication** | JWT + bcrypt |
| **Real-Time Communication** | Socket.io |
| **Excel Processing** | ExcelJS, Multer |
| **Email / Notifications** | Nodemailer + Brevo (SMTP), node-cron |
| **Deployment** | AWS EC2 (Docker), AWS RDS, AWS S3, GitHub Actions, Docker Hub |

---

## 🏗️ System Architecture

Adviso uses a clean **4-layer architecture**:

