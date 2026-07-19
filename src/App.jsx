import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import CollectionPage from "./pages/CollectionPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import DetailsPage from "./pages/DetailsPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<SearchPage />} />
                    <Route path="/details" element={<DetailsPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/collection" element={<CollectionPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}
