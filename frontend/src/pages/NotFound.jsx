import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-lg flex-col items-center px-5 py-24 text-center">
      <span className="font-display text-6xl font-semibold text-teal">404</span>
      <p className="mt-4 font-display text-xl">This posting has been taken down.</p>
      <p className="mt-1 text-sm text-ink-soft">
        The page you're looking for doesn't exist, or moved.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-sm bg-teal px-6 py-3 font-mono text-sm uppercase tracking-wide text-paper hover:bg-teal-dark"
      >
        Back to jobs
      </Link>
    </section>
  );
}
