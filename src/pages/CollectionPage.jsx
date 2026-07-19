import LastVisited from "../components/LastVisited.jsx";

const rows = [
    ["The Boys", "Action / Sci-Fi", "2019", "8.7"],
    ["Superman", "Action / Sci-Fi", "2025", "8.5"],
    ["Avatar: Fire and Ash", "Science Fiction", "2025", "8.9"]
];

export default function CollectionPage() {
    return (
        <>
            <section className="card shadow-sm mb-4">
                <div className="card-body">
                    <h2 className="card-title">My Collection</h2>
                    <div className="table-responsive">
                        <table className="table table-striped align-middle">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Genre</th>
                                    <th>Year</th>
                                    <th>Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => (
                                    <tr key={row[0]}>
                                        {row.map((cell) => <td key={cell}>{cell}</td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
            <LastVisited pageName="collection" />
        </>
    );
}
