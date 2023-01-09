import React from "preact/compat";
import {Link} from "react-router-dom";
import "../styles/navigation.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import useAuthValid from "../hooks/useAuthValid";
import {faUserCircle} from "@fortawesome/free-solid-svg-icons/faUserCircle";
import URLS from "../helpers/URLS";
import pocketbase from "../libraries/Pocketbase";

export default function Navigation() {
    const authValid = useAuthValid();

    return <nav class="nav">
        <div className="nav-logo">
            <Link to="/">ConfigDN</Link>
        </div>
        <div className="nav-spacer"/>
        <div className="nav-links">
            {authValid ? <>
                    <Link to={URLS.DASHBOARD}
                          className="nav-link"><FontAwesomeIcon
                        icon={faUserCircle}/>&nbsp;{pocketbase.authStore?.model?.name || pocketbase.authStore?.model?.username}
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