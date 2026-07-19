import useLastVisited from "../hooks/useLastVisited.js";

export default function LastVisited({ pageName }) {
    const lastVisited = useLastVisited(pageName);

    return <p>Last Visited: <span>{lastVisited}</span></p>;
}
