import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Plus, Users } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { JOB_API } from "../../api/endpoints";
import { setAdminJobs } from "../../redux/slices/jobSlice";
import { formatSalary, timeAgo } from "../../lib/utils";

export default function RecruiterJobs() {
  const dispatch = useDispatch();
  const { adminJobs } = useSelector((state) => state.job);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axiosInstance.get(JOB_API.GET_ADMIN_JOBS);
        dispatch(setAdminJobs(res.data.jobs || []));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [dispatch]);

  return (
    <section className="mx-auto max-w-5xl px-5 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Your postings</h1>
          <p className="mt-1 text-sm text-ink-soft">Manage the roles you've listed.</p>
        </div>
        <Link
          to="/recruiter/jobs/post"
          className="flex items-center gap-1.5 rounded-sm bg-teal px-4 py-2.5 font-mono text-xs uppercase tracking-wide text-paper hover:bg-teal-dark"
        >
          <Plus size={14} /> Post a job
        </Link>
      </div>

      {loading ? (
        <p className="mt-8 font-mono text-sm text-ink-soft">Loading…</p>
      ) : adminJobs.length === 0 ? (
        <div className="mt-8 rounded-md border border-dashed border-line p-10 text-center">
          <p className="font-display text-lg">You haven't posted a role yet.</p>
          <Link to="/recruiter/jobs/post" className="mt-2 inline-block text-teal underline">
            Post your first job
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-md border border-line bg-white/70">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-teal-soft/50 font-mono text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Salary</th>
                <th className="px-4 py-3">Posted</th>
                <th className="px-4 py-3">Applicants</th>
              </tr>
            </thead>
            <tbody>
              {adminJobs.map((job) => (
                <tr key={job._id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <Link to={`/jobs/${job._id}`} className="font-medium hover:text-teal">
                      {job.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{job.location}</td>
                  <td className="px-4 py-3 font-mono text-xs">₹{formatSalary(job.salary)}</td>
                  <td className="px-4 py-3 font-mono text-xs text-ink-soft">{timeAgo(job.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/recruiter/jobs/${job._id}/applicants`}
                      className="flex items-center gap-1.5 font-mono text-xs uppercase text-teal hover:underline"
                    >
                      <Users size={13} /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
