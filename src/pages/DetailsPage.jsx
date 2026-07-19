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


// Bootstrap details starter
// -------------------------
// Uncomment these functions and replace each "..." with the correct value.
// TODO: Replace the ... placeholders with actual values from the details response.
// We are using components because we can merge and reuse both details and reviews from 2 separate API calls.

function formatRuntime(minutes) {
    if (!minutes) {
        return "Runtime unavailable";
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
        return `${remainingMinutes}m`;
    }

    return `${hours}h ${remainingMinutes}m`;
}

function stripHtml(value) {
    if (!value) {
        return "No summary available.";
    }

    return value.replace(/<[^>]*>/g, "");
}

function renderTmdbComponents(details, reviews) {
    const poster = details.poster_path
        ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
        : "";

    const ratingValue = details.vote_average
        ? Math.round(details.vote_average * 10)
        : 0;

    return {
        title: details.title || "Unknown title",

        poster,

        posterAlt: details.title
            ? `${details.title} poster`
            : "Movie poster",

        releaseDate:
            details.release_date || "Release date unavailable",

        runtime: formatRuntime(details.runtime),

        summary:
            details.overview || "No summary available.",

        voteCount:
            details.vote_count !== undefined
                ? `${details.vote_count.toLocaleString()} votes`
                : "Vote count unavailable",

        genres:
            details.genres?.length
                ? details.genres.map((genre) => genre.name)
                : ["Genre unavailable"],

        rating:
            details.vote_average
                ? `${details.vote_average.toFixed(1)}/10`
                : "Not rated",

        ratingValue,

        reviews: reviews.map((review, index) => ({
            id: review.id || `tmdb-review-${index}`,

            author:
                review.author || "Anonymous reviewer",

            text:
                review.content || "No review text available."
        })),

        reviewsMessage:
            reviews.length === 0
                ? "No reviews are currently available for this movie."
                : ""
    };
}

function renderTvMazeComponents(details) {
    const poster =
        details.image?.original ||
        details.image?.medium ||
        "";

    const averageRating = details.rating?.average ?? 0;
    const ratingValue = Math.round(averageRating * 10);

    return {
        title: details.name || "Unknown title",

        poster,

        posterAlt: details.name
            ? `${details.name} poster`
            : "TV show poster",

        releaseDate:
            details.premiered || "Premiere date unavailable",

        runtime: formatRuntime(
            details.averageRuntime || details.runtime
        ),

        summary: stripHtml(details.summary),

        voteCount:
            "TVMaze does not provide a vote count.",

        genres:
            details.genres?.length
                ? details.genres
                : ["Genre unavailable"],

        rating:
            averageRating
                ? `${averageRating}/10`
                : "Not rated",

        ratingValue,

        reviews: [],

        reviewsMessage:
            "TVMaze does not provide user reviews for this show."
    };
}

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
            setComponents(sampleComponents);
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

                    setHeading("TMDB API Response");
                    setJsonData({ details, reviews });
                    setComponents(renderTmdbComponents(details, reviews));
                    setStatus("TMDB details and reviews loaded successfully.");
                    setStatusType("success");

                    return;
                }

                if (source === "tvmaze") {
                    setStatus("Loading TVMaze show details...");

                    const details = await fetchTvMazeShowDetails(id);

                    setHeading("TVMaze API Response");
                    setJsonData({ details });
                    setComponents(renderTvMazeComponents(details));
                    setStatus("TVMaze details loaded successfully.");
                    setStatusType("success");

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

            <section className="mb-4" aria-labelledby="component-examples-heading">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3">

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
