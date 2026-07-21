import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import { APPLICATION_API } from "../../api/endpoints";
import StatusBadge from "../../components/StatusBadge";
import { timeAgo } from "../../lib/utils";

const STATUS_OPTIONS = ["pending", "accepted", "rejected"];

export default function Applicants() {
  const { id } = useParams(); // job id
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplicants = async () => {
    try {
      const res = await axiosInstance.get(APPLICATION_API.GET_APPLICANTS(id));
      setJob(res.data.job);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not load applicants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusChange = async (applicationId, status) => {
    setUpdatingId(applicationId);
    try {
      await axiosInstance.post(APPLICATION_API.UPDATE_STATUS(applicationId), { status });
      toast.success(`Marked as ${status}`);
      fetchApplicants();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <p className="mx-auto max-w-4xl px-5 py-16 font-mono text-sm text-ink-soft">Loading applicants…</p>;
  }

  const applications = job?.applications || [];

  return (
    <section className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="font-display text-3xl font-semibold">{job?.title}</h1>
      <p className="mt-1 text-sm text-ink-soft">{applications.length} applicant(s) so far</p>

      {applications.length === 0 ? (
        <div className="mt-8 rounded-md border border-dashed border-line p-10 text-center">
          <p className="font-display text-lg">No applicants yet.</p>
          <p className="mt-1 text-sm text-ink-soft">Check back once candidates start applying.</p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-md border border-line bg-white/70">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-teal-soft/50 font-mono text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Skills</th>
                <th className="px-4 py-3">Applied</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Update</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id} className="border-b border-line last:border-0 align-top">
                  <td className="px-4 py-3 font-medium">{app.applicant?.fullname || "—"}</td>
                  <td className="px-4 py-3 text-ink-soft">
                    <p>{app.applicant?.email}</p>
                    <p className="font-mono text-xs">{app.applicant?.phoneNumber}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex max-w-[180px] flex-wrap gap-1">
                      {(app.applicant?.profile?.skills || []).slice(0, 4).map((s, i) => (
                        <span key={i} className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-ink-soft">{timeAgo(app.createdAt)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={app.status}
                      disabled={updatingId === app._id}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      className="rounded-sm border border-line bg-white px-2 py-1.5 font-mono text-xs outline-none focus:border-teal disabled:opacity-60"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
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
