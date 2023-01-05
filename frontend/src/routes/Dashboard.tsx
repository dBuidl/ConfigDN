import React from "preact/compat";
import Navigation from "../components/Navigation";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.scss";
import {Outlet} from "react-router-dom";

export default function Dashboard() {
    return <>
        <Navigation/>

        <div className="dashboard">
            <Sidebar/>

            <div className="content">
                <Outlet/>
            </div>
        </div>
    </>
}