# TaskFlow — Frontend

A React + TypeScript web app that combines **task management** (Kanban board) and **image annotation** (polygon drawing). Built as part of the 404 Project Fullstack Engineering task.

---

## Live Demo

| Resource | Link |
|----------|------|
| **Hosted App (Vercel)** | https://task-annotation-frontend-gilt.vercel.app |
| **GitHub Repository** | https://github.com/BanikPuspita/task-annotation-frontend |
| **Backend API (Render)** | https://task-annotation-backend.onrender.com/api |
| **Backend Repo** | https://github.com/BanikPuspita/task-annotation-backend |

### Demo Login Credentials

| Field | Value |
|-------|-------|
| **Email** | `admin@example.com` |
| **Password** | `admin123` |

---

## Features

### Login (`/login`)
- Email and password authentication via JWT
- Protected routes — unauthenticated users are redirected to login

### Task Management (`/tasks`)
- Kanban board with **To Do**, **In Progress**, and **Done** columns
- `<DateSelector />` — reusable date picker to view and manage tasks per day
- Add, edit, and delete tasks via modal
- Drag-and-drop tasks between columns (synced to backend)
- Each task includes title, description, priority, due date, task date, and tags
- Client-side search filter by task title

### Image Annotation (`/annotation`)
- Upload images to the backend (stored on Cloudinary)
- Browse uploaded images in a sidebar gallery
- Draw polygons on images using Konva canvas
- Remove individual polygon annotations
- Annotations persisted to the database via REST API

### Dashboard (`/dashboard`)
- Overview stats: total tasks, status breakdown, image count
- Quick navigation to Tasks and Annotation pages

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 + TypeScript | UI framework |
| Vite 8 | Build tool and dev server |
| Tailwind CSS 4 | Styling |
| React Router 7 | Client-side routing |
| Axios | HTTP client with JWT interceptors |
| @hello-pangea/dnd | Kanban drag-and-drop |
| react-konva + Konva | Canvas-based polygon annotation |
| Sonner | Toast notifications |
| Lucide React | Icons |

---

## Project Structure

```
src/
├── api/                  # Axios instance + API service modules
│   ├── axios.ts          # JWT auth & token refresh interceptors
│   ├── taskApi.ts
│   ├── imageApi.ts
│   └── annotationApi.ts
├── components/
│   ├── DateSelector.tsx  # Reusable date picker
│   ├── KanbanColumn.tsx  # Kanban column wrapper
│   ├── TaskCard.tsx      # Individual task card
│   ├── TaskModal.tsx     # Add/edit task modal
│   ├── AnnotationCanvas.tsx
│   ├── Layout.tsx
│   └── ProtectedRoute.tsx
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Tasks.tsx
│   └── Annotation.tsx
└── types/
    └── task.ts
```

---

## Challenges & How I Overcame Them

### Villain 1: Frontend and backend talking to different databases
After hosting the frontend on Vercel and backend on Render, data created in the UI did not appear in Django admin — and vice versa. The root cause was that the live frontend pointed to the **hosted Render API**, while I was checking data in the **local SQLite** database via `python manage.py runserver`.

**How I won:** Configured `VITE_API_URL` on Vercel to point to the Render backend, and used only the hosted stack for production verification. For local development, I switch `.env` to `http://127.0.0.1:8000/api`.

### Villain 2: Environment variables not baked into production builds
Vite only reads `VITE_*` variables at **build time**, not runtime. A missing `VITE_API_URL` on Vercel meant API calls went nowhere.

**How I won:** Set `VITE_API_URL` in the Vercel dashboard Environment Variables and redeployed. Added `.env.example` and `vercel.json` (SPA rewrites for React Router) to prevent future issues.

### Villain 3: Polygon drawing on a responsive canvas
Implementing click-to-draw polygons on images with correct coordinate mapping across different screen sizes was tricky — especially syncing canvas size with the loaded image aspect ratio.

**How I won:** Used `react-konva` with a `Stage` that scales to the image dimensions, storing raw polygon coordinates in the database so annotations render correctly regardless of display size.

### Villain 4: JWT token expiry mid-session
Users would get logged out unexpectedly when the access token expired during long sessions.

**How I won:** Added an Axios response interceptor in `axios.ts` that automatically refreshes the token using the stored refresh token and retries the failed request transparently.

---

## Prerequisites

| Tool | Version |
|------|---------|
| **Node.js** | v22.13.0 (v18+ should work) |
| **npm** | v9+ |

---

## How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/BanikPuspita/task-annotation-frontend.git
cd task-annotation-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root (use `.env.example` as reference):

```env
# Point to local backend while developing
VITE_API_URL=http://127.0.0.1:8000/api

# Or point to hosted backend
# VITE_API_URL=https://task-annotation-backend.onrender.com/api
```

> Make sure the backend is running before starting the frontend (see backend README).

### 4. Start the development server

```bash
npm run dev
```

Open http://localhost:5173 and log in with the demo credentials above.

### 5. Build for production

```bash
npm run build
npm run preview
```

---

## Deployment (Vercel)

1. Push code to GitHub
2. Import the repo in Vercel
3. Set environment variable:
   ```
   VITE_API_URL=https://task-annotation-backend.onrender.com/api
   ```
4. Deploy — `vercel.json` handles SPA routing automatically

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
