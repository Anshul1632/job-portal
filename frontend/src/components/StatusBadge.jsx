const STYLES = {
  pending: "bg-amber-soft text-amber border-amber",
  accepted: "bg-moss-soft text-moss border-moss",
  rejected: "bg-rust-soft text-rust border-rust",
};

export default function StatusBadge({ status = "pending" }) {
  const style = STYLES[status] || STYLES.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wide ${style}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
