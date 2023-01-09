import Navigation from "../components/Navigation";
import React from "preact/compat";
import "../styles/auth.scss";
import pocketbase from "../libraries/Pocketbase";
import {ClientResponseError} from "pocketbase";
import {useNavigate} from "react-router-dom";
import URLS from "../helpers/URLS";
import {DatabaseInsertError} from "../types/Errors";
import ValidatedInput from "../components/ValidatedInput";
import useAuthRedirect from "../hooks/useAuthRedirect";
import ErrorIfExists from "../components/ErrorIfExists";

export default function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
    const [loginEnabled, setLoginEnabled] = React.useState(true);
    const navigate = useNavigate();
    // redirect to dashboard if already authenticated
    useAuthRedirect(URLS.DASHBOARD, true);

    async function loginToAccount(e: Event) {
        e.preventDefault();
        setLoginEnabled(false);

        try {
            await pocketbase.collection('users').authWithPassword(email, password);

            setErrors({});

            navigate(URLS.DASHBOARD);
        } catch (e) {
            if (e instanceof ClientResponseError) {
                // get the response data
                const userLoginError = (e.data as DatabaseInsertError).message;

                // set the errors
                setErrors({"form": userLoginError});
            } else if (e instanceof Error) {
                // unknown error
                setErrors({"form": e.message});
            }
        }

        setLoginEnabled(true);
    }

    return <div className={"auth-page"}>
        <Navigation/>

        <div className="auth-container">
            <form className="form" onSubmit={loginToAccount}>
                <div className="form-title">Login</div>
                <ValidatedInput value={email} valueUpdate={setEmail} name={"email"} label={"Username or Email"}
                                errors={errors}/>
                <ValidatedInput value={password} valueUpdate={setPassword} name={"password"} label={"Password"}
                                errors={errors} type={"password"}/>
                <div className="form-input">
                    <button type="submit" disabled={!loginEnabled}>Login</button>
                    <div className="errors"><ErrorIfExists error={errors.form}/></div>
                </div>

                {/* todo: add oauth2 options here */}
            </form>
        </div>
    </div>
}