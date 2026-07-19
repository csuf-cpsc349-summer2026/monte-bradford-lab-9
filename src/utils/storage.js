export const feedbackStorageKey = "moviesPortalFeedback";

export function getSavedFeedback() {
    const savedFeedback = localStorage.getItem(feedbackStorageKey);
    return savedFeedback ? JSON.parse(savedFeedback) : [];
}

export function saveFeedbackList(feedbackList) {
    localStorage.setItem(feedbackStorageKey, JSON.stringify(feedbackList));
}
