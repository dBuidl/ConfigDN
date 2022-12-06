import Navigation from "../components/Navigation";
import React, {useEffect} from "preact/compat";
import "../styles/auth.scss";
import pocketbase from "../libraries/Pocketbase";
import {ClientResponseError} from "pocketbase";
import {useNavigate} from "react-router-dom";
import URLS from "../helpers/URLS";
import {DatabaseInsertError} from "../types/Errors";

export default function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [errors, setErrors] = React.useState<string[]>([]);
    const [loginEnabled, setLoginEnabled] = React.useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (pocketbase.authStore.isValid) {
            // check if the user is logged in
            pocketbase.collection('users').authRefresh().then(() => {
                // redirect to dashboard
                if (pocketbase.authStore.isValid) {
                    navigate(URLS.DASHBOARD);
                }
            }).catch(() => {
                // do nothing
            });
        }
    }, []);

    async function loginToAccount(e: Event) {
        e.preventDefault();
        e.stopPropagation();
        setLoginEnabled(false);
        setErrors([]);

        try {
            await pocketbase.collection('users').authWithPassword(email, password);

            navigate(URLS.DASHBOARD);
        } catch (e) {
            if (e instanceof ClientResponseError) {
                // get the response data
                const userLoginError = (e.data as DatabaseInsertError).message;

                // set the errors
                setErrors([userLoginError]);
            } else if (e instanceof Error) {
                // unknown error
                setErrors([e.message]);
            }
        }

        setLoginEnabled(true);
    }

    return <div className={"auth-page"}>
        <Navigation/>

        <div className="auth-container">
            <div className="form" onSubmit={loginToAccount}>
                <div className="form-title">Login</div>
                <div className="form-input">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" value={email}
                           onChange={(e: any) => setEmail(e.target.value)} id="email"/>
                </div>
                <div className="form-input">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" value={password}
                           onChange={(e: any) => setPassword(e.target.value)} id="password"/>
                </div>
                <div className="form-input">
                    <button onClick={loginToAccount} disabled={!loginEnabled}>Login</button>
                    {errors.length > 0 ? <div className="errors">
                        <strong>Errors:</strong>
                        {errors.map((error) => <div className="error">{error}</div>)}
                    </div> : null}
                </div>

                {/* todo: add oauth2 options here */}
            </div>
        </div>
    </div>
}