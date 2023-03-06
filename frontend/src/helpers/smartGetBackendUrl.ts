import config from '../config.json';

export default function smartGetBackendUrl() {
    if (config.POCKETBASE_URL ?? "" !== "") {
        return config.POCKETBASE_URL;
    }

    if (window.location.hostname === "localhost") {
        return "http://localhost:8090"
    }

    return window.location.origin;
}