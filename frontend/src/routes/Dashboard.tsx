import React from "preact/compat";
import Navigation from "../components/Navigation";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard/base.scss";
import {Outlet} from "react-router-dom";
import URLS from "../helpers/URLS";
import useAuthRedirect from "../hooks/useAuthRedirect";

export default function Dashboard() {
    useAuthRedirect(URLS.LOGIN, false);

    return <>
        <Navigation/>

        <div className="dashboard">
            <Sidebar/>

            <Outlet/>
        </div>
    </>
}