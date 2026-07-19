import { useEffect, useState } from "react";
import { getCurrentTimestamp } from "../utils/date.js";

export default function useLastVisited(pageName) {
    const [lastVisited, setLastVisited] = useState("");

    useEffect(() => {
        const storageKey = `lastVisited:${pageName}`;
        const previousVisit = localStorage.getItem(storageKey);
        const currentVisit = getCurrentTimestamp();

        setLastVisited(previousVisit || currentVisit);
        localStorage.setItem(storageKey, currentVisit);
    }, [pageName]);

    return lastVisited;
}
