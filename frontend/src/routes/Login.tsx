import React from "preact/compat";
import pocketbase from "../libraries/Pocketbase";
import {ClientResponseError} from "pocketbase";
import {useNavigate} from "react-router-dom";
import URLS from "../helpers/URLS";
import {DatabaseInsertError} from "../types/Errors";
import ValidatedInput from "../components/auth/ValidatedInput";
import useAuthRedirect from "../hooks/useAuthRedirect";
import logo from "../assets/images/raster/logo.png";
import NavBarLinksContainer from "../components/navbar/NavBarLinksContainer";
import NavAuthLinks from "../components/navbar/NavAuthLinks";
import NavBar from "../components/navbar/NavBar";
import Content from "../components/general/Content";
import Page from "../components/general/Page";

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

    return <Page class="auth-page">
        <NavBar logo={logo}>
            <NavBarLinksContainer>
                <NavAuthLinks/>
            </NavBarLinksContainer>
        </NavBar>

        <Content pageName="auth-content">
            <form className="auth-form" onSubmit={loginToAccount}>
                <div className="auth-form-header">
                    <p>Login</p>
                </div>
                <div class="auth-form-body">
                    <ValidatedInput value={email} valueUpdate={setEmail} name={"email"} label={"Username or Email"}
                                    errors={errors}/>
                    <ValidatedInput value={password} valueUpdate={setPassword} name={"password"} label={"Password"}
                                    errors={errors} type={"password"}/>
                </div>
                <div className="auth-form-footer">
                    <button class="auth-form-submit-button" type="submit" disabled={!loginEnabled}>Login</button>
                    <div class="auth-form-submit-error">
                        {errors.form ? errors.form : ""}
                    </div>
                </div>

                {/* todo: add oauth2 options here */}
            </form>
        </Content>
    </Page>
}