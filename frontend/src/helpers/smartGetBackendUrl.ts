export default function smartGetBackendUrl() {
    if (import.meta.env.VITE_BACKEND_URL ?? "" !== "") {
        return import.meta.env.VITE_BACKEND_URL;
    }

    if (window.location.hostname === "localhost") {
        return "http://localhost:8090"
    }

    return window.location.origin;
}