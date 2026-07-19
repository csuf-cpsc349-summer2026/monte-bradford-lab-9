import { Link } from "react-router-dom";

export default function ResultCard({ item }) {
    return (
        <div className="col">
            <article className="card h-100 shadow-sm">
                {item.image && <img src={item.image} alt={item.alt} className="card-img-top api-card-img" />}
                <div className="card-body d-flex flex-column">
                    <span className={`badge rounded-pill align-self-start mb-2 ${item.sourceClass}`}>{item.source}</span>
                    <h3 className="card-title h5">{item.title}</h3>
                    <p className="card-text">{item.summary}</p>
                    <p className="card-text"><strong>Rating:</strong> {item.rating}</p>
                    <Link className="btn btn-primary navbar-theme-color mt-auto align-self-center" to={item.url}>View Details</Link>
                </div>
            </article>
        </div>
    );
}
