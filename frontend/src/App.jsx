import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import JobDescription from "./pages/JobDescription";
import Profile from "./pages/Profile";
import MyApplications from "./pages/MyApplications";
import NotFound from "./pages/NotFound";

import RecruiterJobs from "./pages/recruiter/RecruiterJobs";
import PostJob from "./pages/recruiter/PostJob";
import Companies from "./pages/recruiter/Companies";
import CompanySetup from "./pages/recruiter/CompanySetup";
import Applicants from "./pages/recruiter/Applicants";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-paper">
        <Navbar />
        <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/jobs/:id" element={<JobDescription />} />

            {/* Applicant-only */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute role="applicant">
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applications"
              element={
                <ProtectedRoute role="applicant">
                  <MyApplications />
                </ProtectedRoute>
              }
            />

            {/* Recruiter-only */}
            <Route
              path="/recruiter/jobs"
              element={
                <ProtectedRoute role="recruiter">
                  <RecruiterJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/jobs/post"
              element={
                <ProtectedRoute role="recruiter">
                  <PostJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/jobs/:id/applicants"
              element={
                <ProtectedRoute role="recruiter">
                  <Applicants />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/companies"
              element={
                <ProtectedRoute role="recruiter">
                  <Companies />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/companies/new"
              element={
                <ProtectedRoute role="recruiter">
                  <CompanySetup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/companies/:id"
              element={
                <ProtectedRoute role="recruiter">
                  <CompanySetup />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
