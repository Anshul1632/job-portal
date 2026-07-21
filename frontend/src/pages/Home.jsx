import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import { JOB_API } from "../api/endpoints";
import { setAllJobs } from "../redux/slices/jobSlice";
import JobCard from "../components/JobCard";
import SearchBar from "../components/SearchBar";

function GuestHero() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-amber">
            Now boarding — new roles daily
          </span>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.05] text-ink md:text-6xl">
            Your next role, <span className="text-teal">stamped</span> and
            ready.
          </h1>
          <p className="mt-5 max-w-md text-ink-soft">
            Browse open positions from real companies, apply in a click, and
            track every application from one board. No noise, just the roles
            worth your time.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              to="/signup"
              className="flex items-center gap-2 rounded-sm bg-teal px-6 py-3 font-mono text-sm uppercase tracking-wide text-paper hover:bg-teal-dark"
            >
              Get started <ArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-sm border border-line px-6 py-3 font-mono text-sm uppercase tracking-wide text-ink hover:bg-teal-soft"
            >
              Log in
            </Link>
          </div>
        </div>

        <div className="relative rounded-md border border-line bg-white/70 p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-ink-soft">
            <Briefcase size={14} /> Sample posting
          </div>
          <div className="ticket-perforation grid grid-cols-[1fr_auto] rounded-sm border border-line">
            <div className="p-4">
              <p className="font-display text-lg font-semibold">
                Senior Frontend Engineer
              </p>
              <p className="font-mono text-xs text-ink-soft">Acme Studio · Remote</p>
              <p className="mt-2 text-sm text-ink-soft">
                Own our design system and ship the interface our users live
                in every day.
              </p>
            </div>
            <div className="flex w-28 flex-col items-center justify-center gap-1 bg-teal-soft p-3 text-center">
              <span className="font-display font-semibold text-teal">₹18L</span>
              <span className="font-mono text-[10px] text-ink-soft">per year</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { allJobs, searchQuery } = useSelector((state) => state.job);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(JOB_API.GET_ALL_JOBS, {
          params: { keyword: searchQuery },
        });
        dispatch(setAllJobs(res.data.jobs || []));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [user, searchQuery, dispatch]);

  if (!user) return <GuestHero />;

  return (
    <section className="mx-auto max-w-6xl px-5 py-10">
      <div className="mb-8 flex flex-col gap-4">
        <h1 className="font-display text-3xl font-semibold">Open positions</h1>
        <SearchBar />
      </div>

      {loading ? (
        <p className="font-mono text-sm text-ink-soft">Loading postings…</p>
      ) : allJobs.length === 0 ? (
        <div className="rounded-md border border-dashed border-line p-10 text-center">
          <p className="font-display text-lg">No postings match yet.</p>
          <p className="mt-1 text-sm text-ink-soft">
            Try a different keyword, or check back soon — new roles go up daily.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {allJobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </section>
  );
}
