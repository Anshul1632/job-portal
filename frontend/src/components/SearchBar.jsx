import { useState } from "react";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchQuery } from "../redux/slices/jobSlice";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(query));
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl overflow-hidden rounded-sm border border-ink/20 bg-white">
      <span className="flex items-center pl-4 text-ink-soft">
        <Search size={18} />
      </span>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by title or keyword — e.g. frontend, react, remote"
        className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-ink-soft/70"
      />
      <button
        type="submit"
        className="whitespace-nowrap bg-teal px-5 font-mono text-xs uppercase tracking-wide text-paper hover:bg-teal-dark"
      >
        Search
      </button>
    </form>
  );
}
