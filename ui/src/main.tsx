import {render} from 'preact';
import {Home} from './routes/Home';
import './styles/style.scss';
import './styles/minireset.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Login, {loginLoader} from "./routes/Login";
import Register, {registerLoader} from "./routes/Register";
import URLS from "./helpers/URLS";
import ErrorNotFound from "./routes/ErrorNotFound";
import Dashboard from "./routes/Dashboard";
import Logout from "./routes/Logout";
import Team, {teamLoader} from "./routes/Dashboards/Team";
import Project, {projectLoader} from "./routes/Dashboards/Project";
import Config, {configLoader} from "./routes/Dashboards/Config";
import DashboardError from "./routes/Dashboards/DashboardError";
import Overview, {overviewLoader} from "./routes/Dashboards/Overview";
import OAuth from "./routes/OAuth";
import ForgotPassword from "./routes/ForgotPassword";
import ResetPassword from "./routes/ResetPassword";
import ChangePassword from "./routes/ChangePassword";
import User, {userLoader} from "./routes/Dashboards/User";
import PrivacyPolicy from "./routes/PrivacyPolicy";
import TermsOfService from "./routes/TermsOfService";

const router = createBrowserRouter([
    {
        path: URLS.HOME,
        errorElement: <ErrorNotFound/>,
        element: <Home/>,
    },
    {
        path: URLS.LOGIN,
        element: <Login/>,
        loader: loginLoader,
    },
    {
        path: URLS.REGISTER,
        element: <Register/>,
        loader: registerLoader,
    },
    {
        path: URLS.FORGOT_PASSWORD,
        element: <ForgotPassword/>,
    },
    {
        path: URLS.RESET_PASSWORD + "/:token" ,
        element: <ResetPassword/>
    },
    {
        path: URLS.CHANGE_PASSWORD,
        element: <ChangePassword/>
    },
    {
        path: URLS.OAUTH2_REDIRECT,
        element: <OAuth/>,
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
            },
            {
                path: "user/:id",
                element: <User />,
                loader: userLoader,
            }
        ]
    },
    {
        path: URLS.LOGOUT,
        element: <Logout/>,
    },
    {
        path: URLS.PRIVACY_POLICY,
        element: <PrivacyPolicy/>,
    },
    {
        path: URLS.TERMS_OF_SERVICE,
        element: <TermsOfService/>,
    }
])

render(<RouterProvider router={router}/>, document.getElementById('app') as HTMLElement)
