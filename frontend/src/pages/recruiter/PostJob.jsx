import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import { JOB_API, COMPANY_API } from "../../api/endpoints";
import { setCompanies } from "../../redux/slices/companySlice";

const JOB_TYPES = ["Full-time", "Part-time", "Internship", "Contract", "Remote"];

export default function PostJob() {
  const dispatch = useDispatch();
  const { companies } = useSelector((state) => state.company);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: JOB_TYPES[0],
    experience: "",
    position: "",
    companyId: "",
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axiosInstance.get(COMPANY_API.GET_ALL);
        dispatch(setCompanies(res.data.companies || []));
      } catch (err) {
        console.error(err);
      }
    };
    fetchCompanies();
  }, [dispatch]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.companyId) {
      toast.error("Register a company first");
      return;
    }
    setSubmitting(true);
    try {
      const res = await axiosInstance.post(JOB_API.POST_JOB, form);
      toast.success(res.data.message || "Job posted");
      navigate("/recruiter/jobs");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not post job");
    } finally {
      setSubmitting(false);
    }
  };

  if (companies.length === 0) {
    return (
      <section className="mx-auto max-w-xl px-5 py-16 text-center">
        <p className="font-display text-xl">Register a company before posting a job.</p>
        <Link to="/recruiter/companies/new" className="mt-3 inline-block text-teal underline">
          Register a company
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="font-display text-3xl font-semibold">Post a job</h1>
      <p className="mt-1 text-sm text-ink-soft">Fill in the details applicants will see.</p>

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
        <label className="flex flex-col gap-1.5 text-sm">
          Company
          <select
            name="companyId"
            required
            value={form.companyId}
            onChange={onChange}
            className="rounded-sm border border-line bg-white px-3 py-2.5 outline-none focus:border-teal"
          >
            <option value="">Select a company</option>
            {companies.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          Job title
          <input
            name="title"
            required
            value={form.title}
            onChange={onChange}
            className="rounded-sm border border-line bg-white px-3 py-2.5 outline-none focus:border-teal"
            placeholder="Senior Frontend Engineer"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          Description
          <textarea
            name="description"
            rows={4}
            required
            value={form.description}
            onChange={onChange}
            className="rounded-sm border border-line bg-white px-3 py-2.5 outline-none focus:border-teal"
            placeholder="What will this person do day-to-day?"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          Requirements (comma separated)
          <input
            name="requirements"
            required
            value={form.requirements}
            onChange={onChange}
            className="rounded-sm border border-line bg-white px-3 py-2.5 outline-none focus:border-teal"
            placeholder="React, Node.js, 3+ years experience"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            Salary (annual, ₹)
            <input
              type="number"
              name="salary"
              required
              value={form.salary}
              onChange={onChange}
              className="rounded-sm border border-line bg-white px-3 py-2.5 outline-none focus:border-teal"
              placeholder="1200000"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            Location
            <input
              name="location"
              required
              value={form.location}
              onChange={onChange}
              className="rounded-sm border border-line bg-white px-3 py-2.5 outline-none focus:border-teal"
              placeholder="Bengaluru, India"
            />
          </label>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            Job type
            <select
              name="jobType"
              value={form.jobType}
              onChange={onChange}
              className="rounded-sm border border-line bg-white px-3 py-2.5 outline-none focus:border-teal"
            >
              {JOB_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            Experience (yrs)
            <input
              type="number"
              name="experience"
              required
              min="0"
              value={form.experience}
              onChange={onChange}
              className="rounded-sm border border-line bg-white px-3 py-2.5 outline-none focus:border-teal"
              placeholder="2"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            Openings
            <input
              type="number"
              name="position"
              required
              min="1"
              value={form.position}
              onChange={onChange}
              className="rounded-sm border border-line bg-white px-3 py-2.5 outline-none focus:border-teal"
              placeholder="1"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-sm bg-teal py-3 font-mono text-sm uppercase tracking-wide text-paper hover:bg-teal-dark disabled:opacity-60"
        >
          {submitting ? "Posting…" : "Post job"}
        </button>
      </form>
    </section>
  );
}
