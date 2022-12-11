import React from "preact/compat";
import {Link} from "react-router-dom";
import "../styles/navigation.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import usePocketbaseAuth from "../hooks/usePocketbaseAuth";
import {faUserCircle} from "@fortawesome/free-solid-svg-icons/faUserCircle";
import URLS from "../helpers/URLS";

export default function Navigation() {
    const pocketbaseAuthStore = usePocketbaseAuth();

    return <nav class="nav">
        <div className="nav-logo">
            <Link to="/">ConfigDN</Link>
        </div>
        <div className="nav-spacer"/>
        <div className="nav-links">
            {pocketbaseAuthStore.isValid ? <>
                    <Link to={URLS.DASHBOARD}
                          className="nav-link"><FontAwesomeIcon
                        icon={faUserCircle}/>&nbsp;{pocketbaseAuthStore.model?.name || pocketbaseAuthStore.model?.username}
                    </Link>
                    <Link to={URLS.LOGOUT} className="nav-link">Logout</Link>
                </> :
                <>
                    <Link to={URLS.LOGIN} className="nav-link">Login</Link>
                    <Link to={URLS.REGISTER} className="nav-link">Register</Link>
                </>
            }
        </div>
    </nav>
}