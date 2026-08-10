import React from "preact/compat";
import Sidebar from "../components/sidebar/Sidebar";
import {Outlet} from "react-router-dom";
import URLS from "../helpers/URLS";
import useAuthRedirect from "../hooks/useAuthRedirect";
import Page from "../components/general/Page";

export default function Dashboard() {
    useAuthRedirect(URLS.LOGIN, false);
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    return <>
        <button
            type="button"
            aria-label={sidebarOpen ? "Close workspace navigation" : "Open workspace navigation"}
            aria-expanded={sidebarOpen}
            aria-controls="workspace-navigation"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed left-4 top-3 z-[60] inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line dark:border-dark-line bg-panel dark:bg-dark-panel text-copy dark:text-dark-copy shadow-lg lg:hidden"
        >
            <span className="sr-only">Workspace navigation</span>
            <span className="flex w-4 flex-col gap-1" aria-hidden="true">
                <span className={`h-0.5 w-full bg-current transition ${sidebarOpen ? "translate-y-1.5 rotate-45" : ""}`}/>
                <span className={`h-0.5 w-full bg-current transition ${sidebarOpen ? "opacity-0" : ""}`}/>
                <span className={`h-0.5 w-full bg-current transition ${sidebarOpen ? "-translate-y-1.5 -rotate-45" : ""}`}/>
            </span>
        </button>
        {sidebarOpen && <button
            type="button"
            aria-label="Close workspace navigation"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-ink/55 dark:bg-dark-ink/75 lg:hidden"
        />}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}/>

        <Page class="dashboard-page ml-0 lg:ml-72">
            <Outlet/>
        </Page>
    </>
}
