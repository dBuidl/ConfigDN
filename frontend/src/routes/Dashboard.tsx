import React from "preact/compat";
import Sidebar from "../components/sidebar/Sidebar";
import {Outlet} from "react-router-dom";
import URLS from "../helpers/URLS";
import useAuthRedirect from "../hooks/useAuthRedirect";
import Page from "../components/general/Page";

export default function Dashboard() {
    useAuthRedirect(URLS.LOGIN, false);

    return <>
        <Sidebar/>

        <Page>
            <Outlet/>
        </Page>
    </>
}