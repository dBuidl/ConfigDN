import React from "preact/compat";
import pocketbase from "../libraries/Pocketbase";
import {Link, useNavigate, useParams} from "react-router-dom";
import URLS from "../helpers/URLS";
import ValidatedInput from "../components/auth/ValidatedInput";
import useAuthRedirect from "../hooks/useAuthRedirect";
import logo from "../assets/images/raster/logo.png";
import NavBarLinksContainer from "../components/navbar/NavBarLinksContainer";
import NavAuthLinks from "../components/navbar/NavAuthLinks";
import NavBar from "../components/navbar/NavBar";
import Content from "../components/general/Content";
import Page from "../components/general/Page";
import ErrorsAsStringDict from "../helpers/ErrorsAsStringDict";

export default function ResetPassword() {
    const [password, setPassword] = React.useState("");
    const [passwordConfirm, setPasswordConfirm] = React.useState("");
    const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
    const [message, setMessage] = React.useState("");
    const [loginEnabled, setLoginEnabled] = React.useState(true);
    // redirect to dashboard if already authenticated
    useAuthRedirect(URLS.DASHBOARD, true);

    const params = useParams();
    const navigate = useNavigate();

    async function loginToAccount(e: Event) {
        e.preventDefault();
        setLoginEnabled(false);

        try {
            await pocketbase.collection('users').confirmPasswordReset(params.token || "", password, passwordConfirm);

            setErrors({});
            setMessage("Your password has been reset successfully. You can now login.");

            setTimeout(() => {
                // check we haven't changed pages since calling this
                if (window.location.pathname === URLS.RESET_PASSWORD + "/" + params.token) {
                    navigate(URLS.LOGIN);
                }
            }, 5000);
        } catch (e) {
            setErrors(ErrorsAsStringDict(e));
        }

        setLoginEnabled(true);
    }

    return <Page className="auth-page">
        <NavBar logo={logo}>
            <NavBarLinksContainer>
                <NavAuthLinks/>
            </NavBarLinksContainer>
        </NavBar>

        <Content pageName="auth-content">
            <form className="auth-form" onSubmit={loginToAccount}>
                <div className="auth-form-header">
                    <p>Reset Password</p>
                </div>
                <div className="auth-form-body">
                    <ValidatedInput value={password} valueUpdate={setPassword} name={"password"} label={"New Password"}
                                    errors={errors} type={"password"} required={true} />
                    <ValidatedInput value={passwordConfirm} valueUpdate={setPasswordConfirm} name={"passwordConfirm"} label={"Confirm New Password"}
                                    errors={errors} type={"password"} required={true} />
                </div>
                <div className="auth-form-footer">
                    <button className="auth-form-submit-button" type="submit" disabled={!loginEnabled}>
                        Reset Password
                    </button>
                    <div className="auth-form-submit-error">
                        {errors.form ? errors.form : ""}
                        {errors.token ? errors.token : ""}
                    </div>
                    <div className="auth-form-submit-success">
                        {message ? message : ""}
                    </div>

                    <p className="auth-form-text">Need a new link? <Link to={URLS.FORGOT_PASSWORD}
                                                                                className="auth-form-link">Forgot Password</Link></p>
                    <p className="auth-form-text">Remember your password? <Link to={URLS.LOGIN}
                                                                                className="auth-form-link">Login</Link></p>

                </div>
            </form>
        </Content>
    </Page>
}