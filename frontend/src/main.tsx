import {render} from 'preact'
import {Home} from './routes/Home'
import './styles/index.scss'
import React from "preact/compat";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Login from "./routes/Login";
import Register from "./routes/Register";
import URLS from "./helpers/URLS";
import ErrorNotFound from "./routes/ErrorNotFound";
import Dashboard from "./routes/Dashboard";
import Logout from "./routes/Logout";

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
            // put teams, projects, envs here
        ]
    },
    {
        path: URLS.LOGOUT,
        element: <Logout/>,
    }
])

render(<RouterProvider router={router}/>, document.getElementById('app') as HTMLElement)
