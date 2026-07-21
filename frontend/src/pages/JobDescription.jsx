import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { MapPin, Briefcase, Clock, Users } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import { JOB_API, APPLICATION_API } from "../api/endpoints";
import { formatSalary, experienceLabel, timeAgo } from "../lib/utils";

export default function JobDescription() {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(JOB_API.GET_JOB_BY_ID(id));
        setJob(res.data.job);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Could not load this posting");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  useEffect(() => {
    if (!user || user.role !== "applicant") return;
    const checkApplied = async () => {
      try {
        const res = await axiosInstance.get(APPLICATION_API.GET_APPLIED_JOBS);
        const apps = res.data.application || [];
        setApplied(apps.some((a) => a.job?._id === id));
      } catch {
        // non-fatal — user just won't see "already applied" state
      }
    };
    checkApplied();
  }, [user, id]);

  const handleApply = async () => {
    setApplying(true);
    try {
      const res = await axiosInstance.get(APPLICATION_API.APPLY(id));
      toast.success(res.data.message || "Applied!");
      setApplied(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not apply");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <p className="mx-auto max-w-3xl px-5 py-16 font-mono text-sm text-ink-soft">Loading posting…</p>;
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 text-center">
        <p className="font-display text-xl">This posting couldn't be found.</p>
        <Link to="/" className="mt-3 inline-block text-teal underline">
          Back to all jobs
        </Link>
      </div>
    );
  }

  const requirements = Array.isArray(job.requirements) ? job.requirements : [];

  return (
    <section className="mx-auto max-w-3xl px-5 py-12">
      <div className="rounded-md border border-line bg-white/70 p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold">{job.title}</h1>
            <p className="mt-1 font-mono text-sm text-ink-soft">
              {job.company?.name || "Company"} · {job.location}
            </p>
          </div>
          <span className="rounded-full bg-teal-soft px-3 py-1 font-mono text-xs uppercase text-teal">
            {job.jobType}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          <Info icon={<MapPin size={14} />} label={job.location} />
          <Info icon={<Briefcase size={14} />} label={experienceLabel(job.experienceLevel)} />
          <Info icon={<Users size={14} />} label={`${job.position} position(s)`} />
          <Info icon={<Clock size={14} />} label={timeAgo(job.createdAt)} />
        </div>

        <div className="my-6 h-px bg-line" />

        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-ink-soft">Annual salary</p>
            <p className="font-display text-2xl font-semibold text-teal">₹{formatSalary(job.salary)}</p>
          </div>

          {user?.role === "recruiter" ? null : (
            <button
              onClick={handleApply}
              disabled={applied || applying || !user}
              className="rounded-sm bg-teal px-6 py-3 font-mono text-sm uppercase tracking-wide text-paper hover:bg-teal-dark disabled:cursor-not-allowed disabled:opacity-60"
              title={!user ? "Log in to apply" : undefined}
            >
              {applied ? "Applied ✓" : applying ? "Applying…" : !user ? "Log in to apply" : "Apply now"}
            </button>
          )}
        </div>

        <div className="my-6 h-px bg-line" />

        <h2 className="font-display text-lg font-semibold">About the role</h2>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
          {job.description}
        </p>

        {requirements.length > 0 && (
          <>
            <h2 className="mt-6 font-display text-lg font-semibold">Requirements</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {requirements.map((r, i) => (
                <span
                  key={i}
                  className="rounded-full border border-line px-3 py-1 font-mono text-xs text-ink-soft"
                >
                  {r.trim()}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function Info({ icon, label }) {
  return (
    <span className="flex items-center gap-1.5 font-mono text-xs text-ink-soft">
      {icon} {label}
    </span>
  );
}
