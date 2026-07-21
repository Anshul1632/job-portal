# NextHire — Frontend

React + Vite + Redux Toolkit + Tailwind CSS v4 frontend, built to match your
existing Node/Express backend.

## Setup

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173` (must match your backend's CORS origin).

Make sure your backend is running at `http://localhost:8000` (or update
`src/api/axiosInstance.js` → `BASE_URL` if your port differs).

## What's included

- **Auth** — signup/login with role toggle (applicant / recruiter), JWT cookie
  session handled automatically via `axios` `withCredentials: true`.
- **Applicant side** — browse & search jobs, view a job, apply, track
  application status, edit profile (bio + skills).
- **Recruiter side** — register/edit companies, post jobs, view postings,
  view applicants per job and update their status (pending/accepted/rejected).
- **Redux Toolkit** store with 4 slices (`auth`, `job`, `company`,
  `application`); `auth` is persisted to localStorage via `redux-persist` so
  the UI remembers who's logged in across refreshes.
- **Role-based routing** via `ProtectedRoute` — recruiter-only and
  applicant-only pages redirect appropriately.

## Known backend issue (not fixed here, since you own the backend code)

In `controllers/user.controller.js`, `updateProfile` reads `req.id`, but your
`isAuthenticated` middleware sets `req.Id` (capital I). As written, profile
updates will silently fail — the frontend's "Save changes" call will succeed
at the network level but the user record won't actually update. Fix is a
one-line change in the controller:

```js
// change this:
const userId = req.id;
// to:
const userId = req.Id;
```

## Folder structure

```
src/
  api/              axios instance + endpoint constants (mirrors your routes)
  redux/            store + slices
  components/       Navbar, JobCard, StatusBadge, SearchBar, ProtectedRoute
  pages/            Home, Login, Signup, JobDescription, Profile, MyApplications
  pages/recruiter/  RecruiterJobs, PostJob, Companies, CompanySetup, Applicants
```

## Design notes

Palette and type system are defined as CSS variables in `src/index.css`
(`@theme` block, Tailwind v4 style) — change them there to re-theme the whole
app. Job listings use a "ticket stub" card (perforated edge, salary on the
tear-off side) as the app's one signature visual element; everything else is
kept deliberately quiet.
