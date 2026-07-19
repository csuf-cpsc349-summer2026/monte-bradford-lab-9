import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
    fetchTmdbMovieDetails,
    fetchTmdbMovieReviews,
    fetchTvMazeShowDetails
} from "../api.js";
import LastVisited from "../components/LastVisited.jsx";

const sampleComponents = {
    title: "Sample Movie Title",
    poster: "",
    posterAlt: "",
    releaseDate: "Release date",
    runtime: "2h 10m",
    summary: "Place the movie overview or TV show summary here. A card keeps the poster, title, genres, rating, and description together as one visual group.",
    voteCount: "Sample count",
    genres: ["Adventure", "Drama", "Science Fiction"],
    rating: "50%",
    ratingValue: 50,
    reviews: [
        {
            id: "sample-review-1",
            author: "Alex Rivera",
            text: "A fun and engaging movie with memorable characters and impressive visuals."
        },
        {
            id: "sample-review-2",
            author: "Jordan Lee",
            text: "The story moves at a great pace and gives the cast plenty of moments to shine."
        }
    ],
    reviewsMessage: "Reviews from the API can be rendered here as cards or alerts."
};

/*
Bootstrap details starter
-------------------------
Uncomment these functions and replace each "..." with the correct value.
TODO: Replace the ... placeholders with actual values from the details response.
We are using components because we can merge and reuse both details and reviews from 2 separate API calls.

function renderTmdbComponents(details, reviews) {
    const poster = "...";
    const rating = "...";

    return {
        title: "...",
        poster,
        posterAlt: "...",
        releaseDate: "...",
        runtime: "...",
        summary: "...",
        voteCount: "...",
        genres: ["..."],
        rating,
        ratingValue: rating,
        reviews: reviews.map((review) => ({
            id: review.id,
            author: "...",
            text: "..."
        })),
        reviewsMessage: reviews.length === 0 ? "..." : ""
    };
}

function renderTvMazeComponents(details) {
    const poster = "...";
    const rating = "...";

    return {
        title: "...",
        poster,
        posterAlt: "...",
        releaseDate: "...",
        runtime: "...",
        summary: "...",
        voteCount: "...",
        genres: ["..."],
        rating,
        ratingValue: rating,
        reviews: [],
        reviewsMessage: "..."
    };
}
*/

export default function DetailsPage() {
    const [searchParams] = useSearchParams();
    const source = searchParams.get("source");
    const id = searchParams.get("id");
    const [heading, setHeading] = useState("API Details Response");
    const [status, setStatus] = useState("Loading API response...");
    const [statusType, setStatusType] = useState("info");
    const [jsonData, setJsonData] = useState({});
    const [components, setComponents] = useState(sampleComponents);

    //useEffect is used to load the details when the component mounts or when the source or id changes (first time the page is loaded)
    useEffect(() => {
        async function loadDetails() {
            if (!source || !id) {
                setStatus("Choose a result from the Search page to load API details.");
                setStatusType("warning");
                setJsonData({});
                return;
            }

            try {
                if (source === "tmdb") {
                    setStatus("Loading TMDB API response...");
                    const [details, reviews] = await Promise.all([
                        fetchTmdbMovieDetails(id),
                        fetchTmdbMovieReviews(id)
                    ]);

                    setJsonData({ details, reviews });
                    setStatus("TMDB details and reviews loaded successfully.");
                    setStatusType("success");

                    // TODO: Uncomment after completing renderTmdbComponents above.
                    // setComponents(renderTmdbComponents(details, reviews));
                    return;
                }

                if (source === "tvmaze") {
                    setStatus("Loading TVMaze show details...");
                    const details = await fetchTvMazeShowDetails(id);

                    setHeading("TVMaze API Response");
                    setJsonData({ details });
                    setStatus("TVMaze details loaded successfully.");
                    setStatusType("success");

                    // TODO: Uncomment after completing renderTvMazeComponents above.
                    // setComponents(renderTvMazeComponents(details));
                    return;
                }

                setStatus("Unknown API source.");
                setStatusType("warning");
                setJsonData({});
            } catch (error) {
                setStatus(source === "tmdb"
                    ? "Unable to load TMDB details. Check your API key and try again."
                    : "Unable to load TVMaze details. Please try again.");
                setStatusType("danger");
            }
        }

        loadDetails();
    }, [source, id]);

    return (
        <>
            <section className="card shadow-sm mb-4">
                <div className="card-body">
                    <h2 className="card-title">Student Task</h2>
                    <p>
                        Use the API JSON response on this page to design your own Bootstrap details page. The details
                        page should be built from API data instead of fixed static movie objects from earlier labs.
                    </p>
                    <p>
                        If the TMDB response does not load below, add your own TMDB API key to
                        <code> .env.local</code>. TVMaze can still be tested without a key.
                    </p>
                    <h3 className="h5">Required Fields</h3>
                    <ul>
                        <li>Title</li>
                        <li>Image or poster</li>
                        <li>Description or summary</li>
                        <li>Rating, shown as a visual component such as a pie-style rating display</li>
                        <li>Genres</li>
                        <li>Release date or premiere date</li>
                        <li>Runtime/Length</li>
                        <li>Vote count or an equivalent message if the API does not provide one</li>
                        <li>Reviews from TMDB or a message when reviews are not available</li>
                    </ul>
                    <p className="mb-0">
                        Additional fields from the JSON response are optional. Choose the ones that make your page
                        more useful and readable.
                    </p>
                </div>
                <div className="card-body">
                    <h2 className="card-title">Reference <code>DetailsPage.jsx</code>:</h2>
                    <video className="w-100 rounded border" controls muted>
                        <source src="/images/demo.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </section>

            <section className="mb-4" aria-labelledby="component-examples-heading">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3">
                    <div>
                        <h2 id="component-examples-heading" className="mb-1">Bootstrap Component Examples</h2>
                        <p className="text-body-secondary mb-0">
                            Sample content only. Replace these values with fields from the selected API response.
                        </p>
                    </div>

                    <div className="dropdown">
                        <button className="btn btn-outline-primary dropdown-toggle" type="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            Movie Actions
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><a className="dropdown-item" href="#api-response">View API response</a></li>
                            <li><a className="dropdown-item" href="#homepage">Official homepage</a></li>
                            <li><a className="dropdown-item" href="#source">View API source</a></li>
                            <li><button className="dropdown-item" type="button">Share movie</button></li>
                        </ul>
                        <p className="small text-body-secondary mt-2 mb-0">
                            <strong>Dropdown:</strong> Groups related movie actions without crowding the page.
                        </p>
                    </div>
                </div>

                <div className="alert alert-info d-flex align-items-center gap-3" role="status">
                    <div className="spinner-border spinner-border-sm flex-shrink-0" aria-hidden="true" />
                    <div>
                        <strong>Loading example:</strong> Fetching additional reviews from the API.
                        <span className="d-block small">
                            <strong>Alert:</strong> Communicates page status. <strong>Spinner:</strong> Shows that an API
                            request is still in progress.
                        </span>
                    </div>
                </div>

                <article className="card shadow-sm overflow-hidden">
                    <div className="row g-0">
                        <div className="col-md-4 col-lg-3 bg-dark text-white d-flex align-items-center justify-content-center p-3">
                            {/* this is to check whether the poster is available */}
                            {components.poster
                                ? <img className="details-poster img-fluid rounded" src={components.poster} alt={components.posterAlt} />
                                : <div className="text-center p-5">
                                    <span className="display-1" aria-hidden="true">Movie</span>
                                    <p className="mb-0">API poster</p>
                                </div>}
                        </div>

                        <div className="col-md-8 col-lg-9">
                            <div className="card-body p-lg-4">
                                <div className="d-flex flex-column flex-lg-row justify-content-between gap-4">
                                    <div>
                                        <h3 className="card-title">{components.title}</h3>
                                        <p className="card-subtitle text-body-secondary mb-3">
                                            <span>{components.releaseDate}</span>
                                            <span aria-hidden="true"> | </span>
                                            <span>{components.runtime}</span>
                                        </p>
                                        <div className="d-flex flex-wrap gap-2 mb-3" aria-label="Genres">
                                            {components.genres.map((genre, index) => (
                                                <span className={`badge ${["text-bg-primary", "text-bg-secondary", "text-bg-success"][index % 3]}`}
                                                    key={`${genre}-${index}`}>{genre}</span>
                                            ))}
                                        </div>
                                        <p className="card-text">{components.summary}</p>
                                        <p className="card-text"><strong>Vote count:</strong> {components.voteCount}</p>
                                        <p className="small text-body-secondary">
                                            <strong>Card:</strong> Organizes the main API fields. <strong>Badges:</strong>
                                            Display short values such as genres or status.
                                        </p>
                                    </div>

                                    <div className="text-center flex-shrink-0">
                                        <div className="rating-progress mx-auto"
                                            style={{ "--rating": `${components.ratingValue}%` }} role="progressbar"
                                            aria-label="Sample rating" aria-valuenow={components.ratingValue}
                                            aria-valuemin="0" aria-valuemax="100">
                                            <span>{components.rating}</span>
                                        </div>
                                        <p className="fw-semibold mb-1">User rating</p>
                                        <p className="small text-body-secondary mb-0">
                                            <strong>Circular progress:</strong> Turns the API rating into a quick visual.
                                        </p>
                                    </div>
                                </div>

                                <hr />
                                <div className="d-flex flex-wrap gap-2">
                                    <button className="btn btn-primary" type="button" data-bs-toggle="modal"
                                        data-bs-target="#review-modal">Read Featured Review</button>
                                    <a className="btn btn-outline-secondary" href="#api-response">Inspect JSON</a>
                                </div>
                                <p className="small text-body-secondary mt-2 mb-0">
                                    <strong>Buttons:</strong> Highlight actions such as opening reviews or visiting a source link.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="card-body border-top">
                        <h4 className="h5">Reviews</h4>
                        {components.reviews.length === 0
                            ? <div className="alert alert-secondary mb-0">{components.reviewsMessage}</div>
                            : components.reviews.map((review) => (
                                <article className="card mb-3" key={review.id}>
                                    <div className="card-body">
                                        <h4 className="card-title h5">{review.author}</h4>
                                        <p className="card-text">{review.text}</p>
                                    </div>
                                </article>
                            ))}
                    </div>
                </article>
            </section>


            <Link className="btn btn-primary navbar-theme-color" to="/">Back to Search</Link>
            <LastVisited pageName="details" />
        </>
    );
}
