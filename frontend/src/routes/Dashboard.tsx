import React from "preact/compat";
import Navigation from "../components/Navigation";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.scss";
import {Outlet, useParams} from "react-router-dom";

export default function Dashboard() {
    const params = useParams();

    return <>
        <div className="dashboard">
            <Sidebar/>

            <Outlet/>
        </div>
    </>
}