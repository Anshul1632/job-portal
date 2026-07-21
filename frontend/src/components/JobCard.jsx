import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { timeAgo, formatSalary, experienceLabel } from "../lib/utils";

export default function JobCard({ job }) {
  const requirements = Array.isArray(job.requirements) ? job.requirements : [];

  return (
    <Link
      to={`/jobs/${job._id}`}
      className="group grid grid-cols-[1fr_auto] overflow-hidden rounded-md border border-line bg-white/60 shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Main stub */}
      <div className="min-w-0 p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
            {timeAgo(job.createdAt)}
          </span>
          <span className="rounded-full bg-teal-soft px-2.5 py-0.5 font-mono text-[11px] uppercase text-teal">
            {job.jobType}
          </span>
        </div>

        <h3 className="truncate font-display text-xl font-semibold text-ink group-hover:text-teal">
          {job.title}
        </h3>
        <p className="mt-0.5 font-mono text-sm text-ink-soft">
          {job.company?.name || "Company"}
        </p>

        <p className="mt-3 line-clamp-2 text-sm text-ink-soft">{job.description}</p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 font-mono text-xs text-ink-soft">
            <MapPin size={13} /> {job.location}
          </span>
          {requirements.slice(0, 3).map((r, i) => (
            <span
              key={i}
              className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-ink-soft"
            >
              {r.trim()}
            </span>
          ))}
        </div>
      </div>

      {/* Ticket stub - perforated */}
      <div className="ticket-perforation flex w-32 shrink-0 flex-col items-center justify-center gap-1 bg-teal-soft px-3 py-5 text-center sm:w-40">
        <span className="font-display text-lg font-semibold text-teal">
          ₹{formatSalary(job.salary)}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">
          per year
        </span>
        <span className="mt-2 font-mono text-[11px] text-ink-soft">
          {experienceLabel(job.experienceLevel)}
        </span>
        <span className="mt-3 rounded-sm bg-teal px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-paper transition-colors group-hover:bg-teal-dark">
          View →
        </span>
      </div>
    </Link>
  );
}
