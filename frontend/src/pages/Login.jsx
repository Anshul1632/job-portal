import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";
import { USER_API } from "../api/endpoints";
import { setUser, setLoading } from "../redux/slices/authSlice";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "", role: "applicant" });
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    dispatch(setLoading(true));
    try {
      const res = await axiosInstance.post(USER_API.LOGIN, form);
      dispatch(setUser(res.data.user));
      toast.success(res.data.message || "Welcome back");
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <section className="mx-auto flex max-w-md flex-col px-5 py-16">
      <h1 className="font-display text-3xl font-semibold">Welcome back</h1>
      <p className="mt-1 text-sm text-ink-soft">Log in to keep track of your applications.</p>

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-2 rounded-sm border border-line bg-white p-1">
          {["applicant", "recruiter"].map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => setForm({ ...form, role: r })}
              className={`rounded-sm py-2 font-mono text-xs uppercase tracking-wide transition-colors ${
                form.role === r ? "bg-teal text-paper" : "text-ink-soft"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <label className="flex flex-col gap-1.5 text-sm">
          Email
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={onChange}
            className="rounded-sm border border-line bg-white px-3 py-2.5 outline-none focus:border-teal"
            placeholder="you@example.com"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          Password
          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={onChange}
            className="rounded-sm border border-line bg-white px-3 py-2.5 outline-none focus:border-teal"
            placeholder="••••••••"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-sm bg-teal py-3 font-mono text-sm uppercase tracking-wide text-paper hover:bg-teal-dark disabled:opacity-60"
        >
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        New here?{" "}
        <Link to="/signup" className="font-medium text-teal underline">
          Create an account
        </Link>
      </p>
    </section>
  );
}
