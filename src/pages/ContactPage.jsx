import { useState } from "react";
import LastVisited from "../components/LastVisited.jsx";
import { getCurrentTimestamp } from "../utils/date.js";
import { getSavedFeedback, saveFeedbackList } from "../utils/storage.js";

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", topic: "Feedback", message: "" });
    const [feedbackList, setFeedbackList] = useState(getSavedFeedback);
    const [submitted, setSubmitted] = useState(null);
    const [error, setError] = useState("");

    function updateForm(event) {
        setForm({ ...form, [event.target.name]: event.target.value });
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
            setError("Please complete your name, email, and message before submitting.");
            setSubmitted(null);
            return;
        }

        const feedback = {
            name: form.name.trim(),
            email: form.email.trim(),
            topic: form.topic,
            message: form.message.trim(),
            timestamp: getCurrentTimestamp()
        };
        const updatedFeedback = [feedback, ...feedbackList];

        saveFeedbackList(updatedFeedback);
        setFeedbackList(updatedFeedback);
        setSubmitted(feedback);
        setError("");
        setForm({ name: "", email: "", topic: "Feedback", message: "" });
    }

    return (
        <>
            <section className="card shadow-sm mb-4">
                <div className="card-body">
                    <h2 className="card-title">Contact Us</h2>
                    <form className="row g-3" onSubmit={handleSubmit}>
                        <div className="col-12 col-md-6">
                            <label className="form-label" htmlFor="name">Name</label>
                            <input id="name" name="name" className="form-control" value={form.name} onChange={updateForm} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="form-label" htmlFor="email">Email</label>
                            <input id="email" name="email" className="form-control" type="email" value={form.email} onChange={updateForm} />
                        </div>
                        <div className="col-12">
                            <label className="form-label" htmlFor="topic">Topic</label>
                            <select id="topic" name="topic" className="form-select" value={form.topic} onChange={updateForm}>
                                <option>Feedback</option>
                                <option>Suggestion</option>
                                <option>Question</option>
                            </select>
                        </div>
                        <div className="col-12">
                            <label className="form-label" htmlFor="message">Message</label>
                            <textarea id="message" name="message" className="form-control" rows="5" value={form.message} onChange={updateForm}></textarea>
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary navbar-theme-color" type="submit">Submit</button>
                        </div>
                    </form>

                    {error && <div className="alert alert-warning mt-4">{error}</div>}
                    {submitted && (
                        <div className="alert alert-success mt-4">
                            <strong>Thank you, {submitted.name}!</strong>
                            <p className="mb-1">We received your {submitted.topic} message and can reply to <strong>[{submitted.email}]</strong>.</p>
                            <p className="feedback-history-message mb-0">"{submitted.message}"</p>
                        </div>
                    )}
                </div>
            </section>

            <section className="card shadow-sm mb-4">
                <div className="card-body">
                    <h2 className="card-title">Saved Feedback</h2>
                    {feedbackList.length === 0 && <p>No previous feedback has been saved yet.</p>}
                    {feedbackList.map((feedback) => (
                        <article className="card card-body mb-3" key={`${feedback.timestamp}-${feedback.email}`}>
                            <h3 className="h5">{feedback.name} - {feedback.topic}</h3>
                            <p>Submitted: {feedback.timestamp} | Email: <strong>[{feedback.email}]</strong></p>
                            <p className="feedback-history-message mb-0">"{feedback.message}"</p>
                        </article>
                    ))}
                </div>
            </section>
            <LastVisited pageName="contact" />
        </>
    );
}
