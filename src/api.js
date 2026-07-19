const tvMazeSearchUrl = "https://api.tvmaze.com/search/shows?q=";
const tvMazeShowUrl = "https://api.tvmaze.com/shows";
const tmdbSearchUrl = "https://api.themoviedb.org/3/search/movie";
const tmdbMovieUrl = "https://api.themoviedb.org/3/movie";
const tmdbPosterBaseUrl = "https://image.tmdb.org/t/p/w342";

export function getTmdbApiKey() {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;

    if (!apiKey || apiKey === "YOUR_TMDB_API_KEY") {
        return "";
    }

    return apiKey;
}

function cleanSummary(summary) {
    if (!summary) {
        return "No summary is available.";
    }

    return summary.replace(/<[^>]*>/g, "");
}

function normalizeTvMazeResults(results) {
    return results.map((result) => {
        const show = result.show;

        return {
            id: show.id,
            source: "TVMaze",
            sourceClass: "text-bg-success",
            title: show.name,
            image: show.image?.medium || "",
            alt: `${show.name} poster`,
            summary: cleanSummary(show.summary),
            rating: show.rating.average || "N/A",
            url: `/details?source=tvmaze&id=${show.id}`
        };
    });
}

function normalizeTmdbResults(results) {
    return results.map((movie) => {
        return {
            id: movie.id,
            source: "TMDB",
            sourceClass: "text-bg-primary",
            title: movie.title,
            image: movie.poster_path ? `${tmdbPosterBaseUrl}${movie.poster_path}` : "",
            alt: `${movie.title} poster`,
            summary: movie.overview || "No summary is available.",
            rating: movie.vote_average ? movie.vote_average.toFixed(1) : "N/A",
            url: `/details?source=tmdb&id=${movie.id}`
        };
    });
}

export async function searchTvMaze(query) {
    const movieQuery = encodeURIComponent(query);
    const response = await fetch(`${tvMazeSearchUrl}${movieQuery}`);

    if (!response.ok) {
        throw new Error("TVMaze request failed.");
    }

    const results = await response.json();
    return normalizeTvMazeResults(results);
}

export async function searchTmdb(query) {
    const apiKey = getTmdbApiKey();

    if (!apiKey) {
        return null;
    }

    const movieQuery = encodeURIComponent(query);
    const url = `${tmdbSearchUrl}?api_key=${apiKey}&query=${movieQuery}&include_adult=false`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("TMDB request failed.");
    }

    const data = await response.json();
    return normalizeTmdbResults(data.results || []);
}

export async function searchMedia(query, selectedSource) {
    const searchTasks = [];

    if (selectedSource === "all" || selectedSource === "tmdb") {
        searchTasks.push(searchTmdb(query));
    }

    if (selectedSource === "all" || selectedSource === "tvmaze") {
        searchTasks.push(searchTvMaze(query));
    }

    const responses = await Promise.allSettled(searchTasks);
    const tmdbResponse = selectedSource === "tvmaze" ? null : responses.shift();
    const tvMazeResponse = selectedSource === "tmdb" ? null : responses.shift();
    const tmdbResults = tmdbResponse?.status === "fulfilled" && tmdbResponse.value ? tmdbResponse.value.slice(0, 6) : [];
    const tvMazeResults = tvMazeResponse?.status === "fulfilled" ? tvMazeResponse.value.slice(0, 6) : [];
    const skippedTmdb = selectedSource !== "tvmaze" && (!tmdbResponse || tmdbResponse.status === "rejected" || !tmdbResponse.value);

    return {
        results: [...tmdbResults, ...tvMazeResults].slice(0, 12),
        skippedTmdb
    };
}

export async function fetchTmdbMovieDetails(movieId) {
    const apiKey = getTmdbApiKey();

    if (!apiKey) {
        throw new Error("Missing TMDB API key.");
    }

    const response = await fetch(`${tmdbMovieUrl}/${movieId}?api_key=${apiKey}&language=en-US`);

    if (!response.ok) {
        throw new Error("TMDB movie details request failed.");
    }

    return response.json();
}

export async function fetchTmdbMovieReviews(movieId) {
    const apiKey = getTmdbApiKey();

    if (!apiKey) {
        throw new Error("Missing TMDB API key.");
    }

    const response = await fetch(`${tmdbMovieUrl}/${movieId}/reviews?api_key=${apiKey}&language=en-US&page=1`);

    if (!response.ok) {
        throw new Error("TMDB movie reviews request failed.");
    }

    const data = await response.json();
    return data.results || [];
}

export async function fetchTvMazeShowDetails(showId) {
    const response = await fetch(`${tvMazeShowUrl}/${showId}`);

    if (!response.ok) {
        throw new Error("TVMaze show details request failed.");
    }

    return response.json();
}
