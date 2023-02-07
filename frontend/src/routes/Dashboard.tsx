import React from "preact/compat";
import Sidebar from "../components/sidebar/Sidebar";
import {Outlet} from "react-router-dom";
import URLS from "../helpers/URLS";
import useAuthRedirect from "../hooks/useAuthRedirect";
import logo from "../assets/images/raster/logo.png";
import NavBarLinksContainer from "../components/navbar/NavBarLinksContainer";
import NavAuthLinks from "../components/navbar/NavAuthLinks";
import NavBar from "../components/navbar/NavBar";

export default function Dashboard() {
    useAuthRedirect(URLS.LOGIN, false);

    return <>
        <NavBar logo={logo}>
            <NavBarLinksContainer>
                <NavAuthLinks/>
            </NavBarLinksContainer>
        </NavBar>

        <div className="dashboard">
            <Sidebar/>

            <Outlet/>
        </div>
    </>
}