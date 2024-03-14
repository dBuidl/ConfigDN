import React from "preact/compat";
import pocketbase from "../libraries/Pocketbase";
import {Link} from "react-router-dom";
import URLS from "../helpers/URLS";
import ValidatedInput from "../components/auth/ValidatedInput";
import useAuthRedirect from "../hooks/useAuthRedirect";
import logo from "../assets/images/raster/logo.png";
import NavBarLinksContainer from "../components/navbar/NavBarLinksContainer";
import NavAuthLinks from "../components/navbar/NavAuthLinks";
import NavBar from "../components/navbar/NavBar";
import Content from "../components/general/Content";
import Page from "../components/general/Page";
import {tWebMailAPIResponse} from "../types/Structures";
import ErrorsAsStringDict from "../helpers/ErrorsAsStringDict";

export default function ForgotPassword() {
    const [email, setEmail] = React.useState("");
    const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
    const [message, setMessage] = React.useState("");
    const [webMailUrl, setWebMailUrl] = React.useState("");
    const [webMailProvider, setWebMailProvider] = React.useState("" as string | null);
    const [wasSuccessful, setWasSuccessful] = React.useState(false);
    const [loginEnabled, setLoginEnabled] = React.useState(true);
    // redirect to dashboard if already authenticated
    useAuthRedirect(URLS.DASHBOARD, true);

    async function loginToAccount(e: Event) {
        e.preventDefault();
        setLoginEnabled(false);

        try {
            setWasSuccessful(false);
            setWebMailUrl("");
            setWebMailProvider(null);
            fetch("https://webmail-url-api.dbuidl.com/api/v1/get_web_mail?email=" + encodeURIComponent(email)).then(async (response) => {
                if (response.ok) {
                    const data = await response.json() as tWebMailAPIResponse;
                    if (data.success) {
                        setWebMailUrl(data.web_mail_url);
                        setWebMailProvider(data.service_name);
                    }
                }
            });

            await pocketbase.collection('users').requestPasswordReset(email);

            setWasSuccessful(true);
            setErrors({});
            setMessage("If an account is associated with this email address, a password reset email has been sent.");

            setTimeout(() => {
                if (window.location.pathname === URLS.FORGOT_PASSWORD) {
                    setMessage("");
                }
            }, 5000);

            //navigate(URLS.LOGIN);
        } catch (e) {
            setErrors(ErrorsAsStringDict(e));
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
            <form class="auth-form" onSubmit={loginToAccount}>
                <div class="auth-form-header">
                    <p>Forgot Password?</p>
                </div>
                <div class="auth-form-body">
                    <ValidatedInput value={email} valueUpdate={setEmail} name={"email"} label={"Email"}
                                    errors={errors} type={"email"} required={true} />
                </div>
                <div className="auth-form-footer">
                    <button className="auth-form-submit-button" type="submit" disabled={!loginEnabled}>Send Password
                        Reset
                    </button>
                    <div className="auth-form-submit-error">
                        {errors.form ? errors.form : ""}
                    </div>
                    <div className="auth-form-submit-success">
                        {message ? message : ""}
                    </div>

                    <button style={!wasSuccessful || webMailUrl === "" ? {display: "none"} : {}} onClick={() => window.open(webMailUrl, "_blank") && false} className="auth-form-submit-button">
                        Click here to open your {webMailProvider ? webMailProvider + ""  : "email"} inbox.
                    </button>

                    <p className="auth-form-text">Remember your password? <Link to={URLS.LOGIN}
                                                                                class="auth-form-link">Login</Link></p>
                    <p className="auth-form-text">Need an account? <Link to={URLS.REGISTER}
                                                                         class="auth-form-link">Register</Link></p>

                </div>
            </form>
        </Content>
    </Page>
}