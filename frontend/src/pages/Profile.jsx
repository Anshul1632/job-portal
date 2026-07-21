import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Pencil } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import { USER_API } from "../api/endpoints";
import { setUser } from "../redux/slices/authSlice";

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(", ") || "",
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axiosInstance.put(USER_API.UPDATE_PROFILE, form);
      dispatch(setUser(res.data.user));
      toast.success(res.data.message || "Profile updated");
      setEditing(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  const skills = user?.profile?.skills || [];

  return (
    <section className="mx-auto max-w-2xl px-5 py-12">
      <div className="rounded-md border border-line bg-white/70 p-8">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold">Your profile</h1>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 rounded-sm border border-line px-3 py-1.5 font-mono text-xs uppercase tracking-wide hover:bg-teal-soft"
            >
              <Pencil size={13} /> Edit
            </button>
          )}
        </div>

        {!editing ? (
          <div className="mt-6 flex flex-col gap-4">
            <Field label="Full name" value={user?.fullname} />
            <Field label="Email" value={user?.email} />
            <Field label="Phone" value={user?.phoneNumber} />
            <Field label="Bio" value={user?.profile?.bio || "—"} />
            <div>
              <p className="font-mono text-xs uppercase tracking-wide text-ink-soft">Skills</p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {skills.length === 0 ? (
                  <span className="text-sm text-ink-soft">No skills added yet</span>
                ) : (
                  skills.map((s, i) => (
                    <span key={i} className="rounded-full border border-line px-3 py-1 font-mono text-xs">
                      {s.trim()}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
            <TextInput label="Full name" name="fullname" value={form.fullname} onChange={onChange} />
            <TextInput label="Email" name="email" type="email" value={form.email} onChange={onChange} />
            <TextInput label="Phone" name="phoneNumber" value={form.phoneNumber} onChange={onChange} />
            <label className="flex flex-col gap-1.5 text-sm">
              Bio
              <textarea
                name="bio"
                rows={3}
                value={form.bio}
                onChange={onChange}
                className="rounded-sm border border-line bg-white px-3 py-2.5 outline-none focus:border-teal"
                placeholder="A couple lines about you"
              />
            </label>
            <TextInput
              label="Skills (comma separated)"
              name="skills"
              value={form.skills}
              onChange={onChange}
              placeholder="React, Node.js, MongoDB"
            />
            <div className="mt-2 flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-sm bg-teal px-5 py-2.5 font-mono text-xs uppercase tracking-wide text-paper hover:bg-teal-dark disabled:opacity-60"
              >
                {submitting ? "Saving…" : "Save changes"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-sm border border-line px-5 py-2.5 font-mono text-xs uppercase tracking-wide hover:bg-teal-soft"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-wide text-ink-soft">{label}</p>
      <p className="mt-0.5 text-sm">{value}</p>
    </div>
  );
}

function TextInput({ label, ...props }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      {label}
      <input
        {...props}
        className="rounded-sm border border-line bg-white px-3 py-2.5 outline-none focus:border-teal"
      />
    </label>
  );
}
