import React from "preact/compat";
import { Link } from "react-router-dom";
import "../styles/navigation.scss";

export default function Navigation() {
    return <nav class="nav">
        <div className="nav-logo">
            <Link to="/">ConfigDN</Link>
        </div>
        <div className="nav-spacer" />
        <div className="nav-links">
            <Link to="/auth/login" className="nav-link">Login</Link>
            <Link to="/auth/register" className="nav-link">Register</Link>
        </div>
    </nav>
}