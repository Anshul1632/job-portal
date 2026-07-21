import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Plus, Building2 } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { COMPANY_API } from "../../api/endpoints";
import { setCompanies } from "../../redux/slices/companySlice";

export default function Companies() {
  const dispatch = useDispatch();
  const { companies } = useSelector((state) => state.company);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axiosInstance.get(COMPANY_API.GET_ALL);
        dispatch(setCompanies(res.data.companies || []));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, [dispatch]);

  return (
    <section className="mx-auto max-w-4xl px-5 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Your companies</h1>
          <p className="mt-1 text-sm text-ink-soft">Register a company before posting a job under it.</p>
        </div>
        <Link
          to="/recruiter/companies/new"
          className="flex items-center gap-1.5 rounded-sm bg-teal px-4 py-2.5 font-mono text-xs uppercase tracking-wide text-paper hover:bg-teal-dark"
        >
          <Plus size={14} /> New company
        </Link>
      </div>

      {loading ? (
        <p className="mt-8 font-mono text-sm text-ink-soft">Loading…</p>
      ) : companies.length === 0 ? (
        <div className="mt-8 rounded-md border border-dashed border-line p-10 text-center">
          <Building2 className="mx-auto mb-2 text-ink-soft" />
          <p className="font-display text-lg">No companies registered yet.</p>
          <Link to="/recruiter/companies/new" className="mt-2 inline-block text-teal underline">
            Register your first company
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-3">
          {companies.map((c) => (
            <Link
              key={c._id}
              to={`/recruiter/companies/${c._id}`}
              className="flex items-center justify-between rounded-md border border-line bg-white/70 px-5 py-4 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-soft text-teal">
                  {c.logo ? (
                    <img src={c.logo} alt={c.name} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <span className="font-display font-semibold">{c.name?.[0]?.toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <p className="font-display font-semibold">{c.name}</p>
                  <p className="font-mono text-xs text-ink-soft">{c.location || "Location not set"}</p>
                </div>
              </div>
              <span className="font-mono text-xs uppercase text-teal">Edit →</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
