import LastVisited from "../components/LastVisited.jsx";

export default function AboutPage() {
    return (
        <>
            <section className="card shadow-sm mb-4">
                <div className="card-body">
                    <h2 className="card-title">About</h2>
                    <p className="card-text">
                        Movies Portal is a classroom project for practicing frontend development with HTML, CSS,
                        JavaScript. It is built using React and Bootstrap, and it allows users to browse and search for movies.
                    </p>
                </div>
            </section>
            <LastVisited pageName="about" />
        </>
    );
}
