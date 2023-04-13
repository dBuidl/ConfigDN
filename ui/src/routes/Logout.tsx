import React, {useEffect} from "preact/compat";
import {useNavigate} from "react-router-dom";
import URLS from "../helpers/URLS";
import pocketbase from "../libraries/Pocketbase";

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        // DO NOT USE THE usePocketbaseAuth() HOOK HERE as it will cause the user to be logged back in immediately after logging out
        pocketbase.authStore.clear();
        navigate(URLS.HOME);
    }, []);

    return <div className="logout">
        <p>Logging you out...</p>
    </div>;
}