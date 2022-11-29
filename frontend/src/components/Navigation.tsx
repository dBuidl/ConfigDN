import React from "preact/compat";
import { Link } from "react-router-dom";

export default function Navigation() {
    return <nav class="nav">
        <div className="nav-logo">
            <Link to="/">ConfigDN</Link>
        </div>
    </nav>
}