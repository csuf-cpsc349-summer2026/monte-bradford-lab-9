import { useState } from "react";
import { searchMedia } from "../api.js";
import LastVisited from "../components/LastVisited.jsx";
import ResultCard from "../components/ResultCard.jsx";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [source, setSource] = useState("all");
    const [results, setResults] = useState([]);
    const [status, setStatus] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        if (!query.trim()) {
            setStatus("Enter a title to search.");
            setResults([]);
            return;
        }

        setStatus("Searching...");

        try {
            const search = await searchMedia(query.trim(), source);

            setResults(search.results);

            if (search.skippedTmdb && source === "tmdb") {
                setStatus("Add a TMDB key in .env.local before searching TMDB.");
            } else if (search.skippedTmdb && source !== "tvmaze") {
                setStatus(`Showing ${search.results.length} TVMaze result(s). Add a TMDB key in .env.local to include TMDB.`);
            } else {
                setStatus(`Showing ${search.results.length} result(s).`);
            }
        } catch (error) {
            setStatus("Unable to load results right now. Please try again later.");
        }
    }

    return (
        <>
            <section className="alert alert-info shadow-sm" role="alert">
                <h2 className="h4 alert-heading">Lab 9 React Migration</h2>
                <p>
                    Lab 8 used direct DOM updates. Lab 9 converts the same portal into React components using state,
                    props, events, and effects.
                </p>
                <p className="mb-0">
                    TVMaze works without a key. TMDB requires your key in <code>.env.local</code>.
                </p>
            </section>

            <section className="card shadow-sm mb-4">
                <div className="card-body">
                    <h2 className="card-title">Search Movies and Shows</h2>
                    <form className="row g-3 align-items-end" onSubmit={handleSubmit}>
                        <div className="col-12 col-md-6">
                            <label className="form-label" htmlFor="media-search-input">Title</label>
                            <input id="media-search-input" className="form-control" type="search"
                                value={query} onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search movies and shows" />
                        </div>

                        <div className="col-12 col-md-4">
                            <label className="form-label" htmlFor="source-filter">Source</label>
                            <select id="source-filter" className="form-select" value={source}
                                onChange={(event) => setSource(event.target.value)}>
                                <option value="all">All</option>
                                <option value="tmdb">TMDB only</option>
                                <option value="tvmaze">TVMaze only</option>
                            </select>
                        </div>

                        <div className="col-12 col-md-2">
                            <button className="btn btn-primary w-100 navbar-theme-color" type="submit">Search</button>
                        </div>
                    </form>

                    <p className="mt-3 mb-0" aria-live="polite">{status}</p>
                </div>
            </section>

            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                {/* This is a unique way to iterate over the results in React. 
                For each item in the results array, we create a ResultCard component */}
                {results.map((item) => <ResultCard key={`${item.source}-${item.id}`} item={item} />)}
            </div>

            <LastVisited pageName="search" />
        </>
    );
}
