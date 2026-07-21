import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import { COMPANY_API } from "../../api/endpoints";

export default function CompanySetup() {
  const { id } = useParams(); // undefined => create mode
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    description: "",
    website: "",
    location: "",
  });

  useEffect(() => {
    if (!isEdit) return;
    const fetchCompany = async () => {
      try {
        const res = await axiosInstance.get(COMPANY_API.GET_BY_ID(id));
        const c = res.data.company;
        setForm({
          companyName: c.name || "",
          description: c.description || "",
          website: c.website || "",
          location: c.location || "",
        });
      } catch (err) {
        toast.error(err?.response?.data?.message || "Could not load company");
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id, isEdit]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEdit) {
        await axiosInstance.put(COMPANY_API.UPDATE(id), {
          name: form.companyName,
          description: form.description,
          website: form.website,
          location: form.location,
        });
        toast.success("Company updated");
      } else {
        await axiosInstance.post(COMPANY_API.REGISTER, {
          companyName: form.companyName,
        });
        toast.success("Company registered — add more details any time");
      }
      navigate("/recruiter/companies");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="mx-auto max-w-2xl px-5 py-16 font-mono text-sm text-ink-soft">Loading…</p>;
  }

  return (
    <section className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="font-display text-3xl font-semibold">
        {isEdit ? "Edit company" : "Register a company"}
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        {isEdit
          ? "Update your company's public details."
          : "Give it a name to start — you can fill in the rest afterwards."}
      </p>

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
        <label className="flex flex-col gap-1.5 text-sm">
          Company name
          <input
            name="companyName"
            required
            value={form.companyName}
            onChange={onChange}
            className="rounded-sm border border-line bg-white px-3 py-2.5 outline-none focus:border-teal"
            placeholder="Acme Studio"
          />
        </label>

        {isEdit && (
          <>
            <label className="flex flex-col gap-1.5 text-sm">
              Description
              <textarea
                name="description"
                rows={3}
                value={form.description}
                onChange={onChange}
                className="rounded-sm border border-line bg-white px-3 py-2.5 outline-none focus:border-teal"
                placeholder="What does this company do?"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              Website
              <input
                name="website"
                value={form.website}
                onChange={onChange}
                className="rounded-sm border border-line bg-white px-3 py-2.5 outline-none focus:border-teal"
                placeholder="https://example.com"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              Location
              <input
                name="location"
                value={form.location}
                onChange={onChange}
                className="rounded-sm border border-line bg-white px-3 py-2.5 outline-none focus:border-teal"
                placeholder="Bengaluru, India"
              />
            </label>
          </>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-sm bg-teal py-3 font-mono text-sm uppercase tracking-wide text-paper hover:bg-teal-dark disabled:opacity-60"
        >
          {submitting ? "Saving…" : isEdit ? "Save changes" : "Register company"}
        </button>
      </form>
    </section>
  );
}
