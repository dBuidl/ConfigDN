import {render} from 'preact';
import {Home} from './routes/Home';
import './styles/style.scss';
import './styles/minireset.css';
import React from "preact/compat";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Login from "./routes/Login";
import Register from "./routes/Register";
import URLS from "./helpers/URLS";
import ErrorNotFound from "./routes/ErrorNotFound";
import Dashboard from "./routes/Dashboard";
import Logout from "./routes/Logout";
import Team, {teamLoader} from "./routes/Dashboards/Team";
import Project, {projectLoader} from "./routes/Dashboards/Project";
import Config, {configLoader} from "./routes/Dashboards/Config";
import DashboardError from "./routes/Dashboards/DashboardError";
import Overview, {overviewLoader} from "./routes/Dashboards/Overview";

// TODO: remember that react-router now has loaders (https://reactrouter.com/en/main/route/loader) which can be used to load data before rendering the component

const router = createBrowserRouter([
    {
        path: URLS.HOME,
        errorElement: <ErrorNotFound/>,
        element: <Home/>,
    },
    {
        path: URLS.LOGIN,
        element: <Login/>,
    },
    {
        path: URLS.REGISTER,
        element: <Register/>,
    },
    {
        path: URLS.DASHBOARD,
        element: <Dashboard/>,
        children: [
            {
                path: "",
                element: <Overview/>,
                loader: overviewLoader,
                errorElement: <DashboardError/>,
            },
            {
                path: ":team",
                element: <Team/>,
                loader: teamLoader,
                errorElement: <DashboardError/>,
            },
            {
                path: ":team/:project",
                element: <Project/>,
                loader: projectLoader,
                errorElement: <DashboardError/>,
            },
            {
                path: ":team/:project/:config",
                element: <ErrorNotFound/>
            },
            {
                path: ":team/:project/:config/:environment",
                element: <Config/>,
                loader: configLoader,
                errorElement: <DashboardError/>,
            }
        ]
    },
    {
        path: URLS.LOGOUT,
        element: <Logout/>,
    }
])

render(<RouterProvider router={router}/>, document.getElementById('app') as HTMLElement)
