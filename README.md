# CMS Web Application

This project is a modern, headless Content Management System (CMS) and public-facing website built as a tech interview assignment.

## Architecture Overview

The system follows a classic headless CMS architecture, decoupled into two main services:
1. **Frontend (Next.js)**: Responsible for both the public-facing website (fetching data from APIs) and the private Admin Dashboard.
2. **Backend (Express.js)**: Exposes RESTful APIs for authentication, content creation, and retrieval.
3. **Database (MongoDB)**: Stores `User` data and `Page` schemas containing structured content blocks.

Both the Frontend and Backend are containerized using Docker, with a single `docker-compose.yml` to orchestrate them alongside a MongoDB instance.

## Technology Choices

- **Frontend**: Next.js 15 (App Router), React 19, Redux Toolkit (RTK Query for data fetching and caching).
- **Styling**: Vanilla CSS with a highly premium, modern dark-mode aesthetic (Glassmorphism, CSS gradients).
- **Backend**: Express.js with TypeScript for type safety, maintainability, and rapid development.
- **Database**: MongoDB via Mongoose. The flexible document model perfectly accommodates dynamic, rich content blocks.
- **Authentication**: JWT stored in HTTP-Only cookies for improved security over LocalStorage.

## Assumptions & Design Decisions

1. **Content Modeling (Blocks)**: Instead of a monolithic HTML string, content is stored as an array of structured blocks (e.g., `text`, `table`, `equation`, `list`, `html`, `markdown`). This enables the frontend to render each type appropriately and ensures the content is inherently cross-platform.
2. **Redux State vs Local State**: 
   - **Redux (RTK)** is used for global Authentication state (`authSlice`) and Server Data fetching/caching (`apiSlice`).
   - **Local State** (`useState`) is strictly utilized for UI-specific transient state (e.g., the content of a form while editing a page).
3. **Design**: Since a direct export of the Figma design was not accessible by the automated web scraper, a bespoke, highly responsive, premium UI was crafted from scratch to demonstrate frontend styling proficiency.
4. **Seeding**: The backend is configured to automatically create an `admin` user upon first login attempt if no users exist.

## Setup & Run Instructions

### Prerequisites
- Docker and Docker Compose installed on your system.

### Running the Application

1. At the root of the project, start the services using Docker Compose:
   ```bash
   docker-compose up --build
   ```
2. The services will be available at:
   - **Public Website & Admin Panel**: `http://localhost:3000`
   - **Backend API**: `http://localhost:5000`

### Evaluation Guide

1. Navigate to `http://localhost:3000/admin/login`
2. **Credentials for evaluation:**
   - **Username**: `admin`
   - **Password**: `admin`
3. Upon login, you will be directed to the Admin Dashboard.
4. Navigate to the **Pages** section via the sidebar to create, edit, or delete pages and content blocks.
5. Visit `http://localhost:3000` to see your dynamically generated pages appear on the public site!
