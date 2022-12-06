import Navigation from "../components/Navigation";
import React from "preact/compat";
import "../styles/auth.scss";
import pocketbase from "../libraries/Pocketbase";
import {ClientResponseError} from "pocketbase";
import ErrorsAsArray from "../helpers/ErrorsAsArray";
import {useNavigate} from "react-router-dom";
import URLS from "../helpers/URLS";
import {DatabaseInsertError} from "../types/Errors";

export default function Register() {
    // register = POST http://127.0.0.1:8090/api/users
    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [passwordConfirm, setPasswordConfirm] = React.useState("");
    const [errors, setErrors] = React.useState<string[]>([]);
    const [registerEnabled, setRegisterEnabled] = React.useState(true);
    const navigate = useNavigate();

    async function createAccount(e: Event) {
        e.preventDefault();
        e.stopPropagation();
        setRegisterEnabled(false);
        setErrors([]);

        try {
            await pocketbase.collection('users').create({
                username,
                email,
                password,
                passwordConfirm,
                emailVisibility: true,
            });

            await pocketbase.collection('users').authWithPassword(email, password);

            navigate(URLS.DASHBOARD);
        } catch (e) {
            if (e instanceof ClientResponseError) {
                // get the response data
                const userCreateError = (e.data as DatabaseInsertError).data;

                // set the errors
                setErrors(ErrorsAsArray(userCreateError));
            } else if (e instanceof Error) {
                // unknown error
                setErrors([e.message]);
            }
        }

        setRegisterEnabled(true);
    }

    return <div className={"auth-page"}>
        <Navigation/>

        <div className="auth-container">
            <div className="form" onSubmit={createAccount}>
                <div className="form-title">Register</div>
                <div className="form-input">
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" value={username}
                           onChange={(e: any) => setUsername(e.target.value)} id="username"/>
                </div>
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
                    <label htmlFor="password-confirm">Confirm Password</label>
                    <input type="password" name="password-confirm" value={passwordConfirm}
                           onChange={(e: any) => setPasswordConfirm(e.target.value)} id="password-confirm"/>
                </div>
                <div className="form-input">
                    <button onClick={createAccount} disabled={!registerEnabled}>Register</button>
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