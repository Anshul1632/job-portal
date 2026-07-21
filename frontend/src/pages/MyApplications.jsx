import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { APPLICATION_API } from "../api/endpoints";
import { setAppliedJobs } from "../redux/slices/applicationSlice";
import StatusBadge from "../components/StatusBadge";
import { timeAgo, formatSalary } from "../lib/utils";

export default function MyApplications() {
  const dispatch = useDispatch();
  const { appliedJobs } = useSelector((state) => state.application);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplied = async () => {
      try {
        const res = await axiosInstance.get(APPLICATION_API.GET_APPLIED_JOBS);
        dispatch(setAppliedJobs(res.data.application || []));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplied();
  }, [dispatch]);

  return (
    <section className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="font-display text-3xl font-semibold">My applications</h1>
      <p className="mt-1 text-sm text-ink-soft">Every role you've applied to, tracked here.</p>

      {loading ? (
        <p className="mt-8 font-mono text-sm text-ink-soft">Loading…</p>
      ) : appliedJobs.length === 0 ? (
        <div className="mt-8 rounded-md border border-dashed border-line p-10 text-center">
          <p className="font-display text-lg">No applications yet.</p>
          <Link to="/" className="mt-2 inline-block text-teal underline">
            Browse open roles
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-md border border-line bg-white/70">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-teal-soft/50 font-mono text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Salary</th>
                <th className="px-4 py-3">Applied</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {appliedJobs.map((app) => (
                <tr key={app._id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <Link to={`/jobs/${app.job?._id}`} className="font-medium hover:text-teal">
                      {app.job?.title || "—"}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{app.job?.company?.name || "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs">₹{formatSalary(app.job?.salary)}</td>
                  <td className="px-4 py-3 font-mono text-xs text-ink-soft">{timeAgo(app.createdAt)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={app.status} />
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
