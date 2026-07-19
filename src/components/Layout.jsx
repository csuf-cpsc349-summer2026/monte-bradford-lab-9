import { Link, NavLink } from "react-router-dom";

export default function Layout({ children }) {
    return (
        <>
            <header className="bg-primary text-white py-5 navbar-theme-color">
                <div className="container">
                    <h1>Movies Portal</h1>
                    <p className="mb-0">Welcome to the React Movies Portal. Explore API data with components and state.</p>
                </div>
            </header>

            <nav className="navbar navbar-expand-lg navbar-theme-color-2">
                <div className="container">
                    <Link className="navbar-brand fw-bold" to="/">Home</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#main-nav"
                        aria-controls="main-nav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div id="main-nav" className="collapse navbar-collapse">
                        <ul className="navbar-nav ms-auto fw-bold">
                            <li className="nav-item"><NavLink className="nav-link" to="/">Search</NavLink></li>
                            <li className="nav-item"><NavLink className="nav-link" to="/about">About</NavLink></li>
                            <li className="nav-item"><NavLink className="nav-link" to="/collection">My Collection</NavLink></li>
                            <li className="nav-item"><NavLink className="nav-link" to="/contact">Contact Us</NavLink></li>
                        </ul>
                    </div>
                </div>
            </nav>

            <main className="container my-4">{children}</main>

            <footer>
                <p>&copy; 2026 Movies Portal</p>
                <p>Contact us at <a href="mailto:movies@example.com">movies@cspc349.com</a></p>
            </footer>
        </>
    );
}
