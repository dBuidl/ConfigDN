import Navigation from "../components/Navigation";
import React from "preact/compat";
import "../styles/auth.scss";
import pocketbase from "../libraries/Pocketbase";
import {ClientResponseError} from "pocketbase";
import ErrorsAsStringDict from "../helpers/ErrorsAsStringDict";
import URLS from "../helpers/URLS";
import {DatabaseInsertError} from "../types/Errors";
import useAuthStatusRedirect from "../hooks/useAuthStatusRedirect";
import {useNavigate} from "react-router-dom";
import ValidatedInput from "../components/ValidatedInput";
import ErrorIfExists from "../components/ErrorIfExists";

export default function Register() {
    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [passwordConfirm, setPasswordConfirm] = React.useState("");
    const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
    const [registerEnabled, setRegisterEnabled] = React.useState(true);
    const navigate = useNavigate();
    // redirect to dashboard if already authenticated
    useAuthStatusRedirect(URLS.DASHBOARD, true);

    async function createAccount(e: Event) {
        e.preventDefault();
        setRegisterEnabled(false);

        try {
            await pocketbase.collection('users').create({
                username,
                email,
                password,
                passwordConfirm,
                emailVisibility: false,
            });

            await pocketbase.collection('users').authWithPassword(email, password);

            setErrors({});

            navigate(URLS.DASHBOARD);
        } catch (e) {
            if (e instanceof ClientResponseError) {
                // get the response data
                const userCreateError = (e.data as DatabaseInsertError);

                // check if data is empty
                if (Object.keys(userCreateError.data).length === 0) {
                    setErrors({form: userCreateError.message});
                } else {
                    // set the errors
                    setErrors(ErrorsAsStringDict(userCreateError.data));
                }
            } else if (e instanceof Error) {
                // unknown error
                setErrors({form: e.message});
            }
        }

        setRegisterEnabled(true);
    }

    return <div className={"auth-page"}>
        <Navigation/>

        <div className="auth-container">
            <form className="form" onSubmit={createAccount}>
                <div className="form-title">Register</div>
                <ValidatedInput value={username} valueUpdate={setUsername} name={"username"}
                                label={"Username (optional)"}
                                errors={errors}/>
                <ValidatedInput value={email} valueUpdate={setEmail} name={"email"} label={"Email"} errors={errors}
                                type={"email"}/>
                <ValidatedInput value={password} valueUpdate={setPassword} name={"password"} label={"Password"}
                                type={"password"} errors={errors}/>
                <ValidatedInput value={passwordConfirm} valueUpdate={setPasswordConfirm} name={"passwordConfirm"}
                                label={"Confirm Password"} type={"password"} errors={errors}/>
                <div className="form-input">
                    <button type="submit" disabled={!registerEnabled}>Register</button>
                    <div className="errors"><ErrorIfExists error={errors.form}/></div>
                </div>

                {/* todo: add oauth2 options here */}
            </form>
        </div>
    </div>
}