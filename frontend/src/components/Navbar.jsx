import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, Menu, X, User2 } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";
import { USER_API } from "../api/endpoints";
import { logoutUser } from "../redux/slices/authSlice";

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await axiosInstance.get(USER_API.LOGOUT);
      dispatch(logoutUser());
      toast.success(res.data.message || "Logged out");
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Logout failed");
    }
  };

  const applicantLinks = [
    { to: "/", label: "Browse jobs" },
    { to: "/applications", label: "My applications" },
  ];

  const recruiterLinks = [
    { to: "/recruiter/jobs", label: "My postings" },
    { to: "/recruiter/companies", label: "Companies" },
    { to: "/recruiter/jobs/post", label: "Post a job" },
  ];

  const links = !user ? [] : user.role === "recruiter" ? recruiterLinks : applicantLinks;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="font-display text-2xl font-semibold tracking-tight text-teal">
          Next<span className="text-amber">Hire</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="font-mono text-[13px] uppercase tracking-wide text-ink-soft transition-colors hover:text-teal"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {!user ? (
            <>
              <Link
                to="/login"
                className="font-mono text-[13px] uppercase tracking-wide text-ink-soft hover:text-teal"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="rounded-sm bg-teal px-4 py-2 font-mono text-[13px] uppercase tracking-wide text-paper transition-colors hover:bg-teal-dark"
              >
                Sign up
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((p) => !p)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-teal-soft text-teal"
              >
                {user.profile?.profilePhoto ? (
                  <img
                    src={user.profile.profilePhoto}
                    alt={user.fullname}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <span className="font-display text-sm font-semibold">
                    {user.fullname?.[0]?.toUpperCase()}
                  </span>
                )}
              </button>

              {profileOpen && (
                <div
                  onMouseLeave={() => setProfileOpen(false)}
                  className="absolute right-0 mt-2 w-56 rounded-sm border border-line bg-paper p-3 shadow-lg"
                >
                  <p className="truncate px-2 py-1 font-display text-sm font-semibold">
                    {user.fullname}
                  </p>
                  <p className="truncate px-2 pb-2 font-mono text-xs text-ink-soft">
                    {user.email}
                  </p>
                  <div className="my-1 h-px bg-line" />
                  {user.role === "applicant" && (
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 rounded-sm px-2 py-2 text-sm hover:bg-teal-soft"
                    >
                      <User2 size={15} /> View profile
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left text-sm text-rust hover:bg-rust-soft"
                  >
                    <LogOut size={15} /> Log out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMenuOpen((m) => !m)} aria-label="Menu">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-line px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} className="font-mono text-sm uppercase text-ink-soft">
                {l.label}
              </Link>
            ))}
            {!user ? (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="font-mono text-sm uppercase">
                  Log in
                </Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="font-mono text-sm uppercase text-teal">
                  Sign up
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className="text-left font-mono text-sm uppercase text-rust">
                Log out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
