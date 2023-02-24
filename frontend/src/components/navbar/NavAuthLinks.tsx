import useAuthValid from "../../hooks/useAuthValid";
import URLS from "../../helpers/URLS";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserCircle} from "@fortawesome/free-solid-svg-icons/faUserCircle";
import pocketbase from "../../libraries/Pocketbase";
import React from "preact/compat";
import NavBarLink from "./NavBarLink";

export default function NavAuthLinks() {
    const authValid = useAuthValid();

    if (authValid) {
        return <>
            <NavBarLink href={URLS.DASHBOARD}>
                <FontAwesomeIcon
                    icon={faUserCircle}/>&nbsp;{pocketbase.authStore?.model?.username}
            </NavBarLink>
            <NavBarLink href={URLS.LOGOUT}>Logout</NavBarLink>
        </>;
    }

    return <>
        <NavBarLink href={URLS.LOGIN}>Login</NavBarLink>
        <NavBarLink href={URLS.REGISTER}>Register</NavBarLink>
    </>;
}