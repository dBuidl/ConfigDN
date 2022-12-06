import {render} from 'preact'
import {Home} from './routes/Home'
import './styles/index.scss'
import React from "preact/compat";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Login from "./routes/Login";
import Register from "./routes/Register";
import URLS from "./helpers/URLS";

// TODO: remember that react-router now has loaders (https://reactrouter.com/en/main/route/loader) which can be used to load data before rendering the componentpo

const router = createBrowserRouter([
    {
        path: URLS.HOME,
        element: <Home/>,
    },
    {
        path: URLS.LOGIN,
        element: <Login/>,
    },
    {
        path: URLS.REGISTER,
        element: <Register/>,
    }
])

render(<RouterProvider router={router}/>, document.getElementById('app') as HTMLElement)
