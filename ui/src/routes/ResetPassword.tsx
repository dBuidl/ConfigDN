import React from "preact/compat";
import pocketbase from "../libraries/Pocketbase";
import {ClientResponseError} from "pocketbase";
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

            //navigate(URLS.LOGIN);
        } catch (e) {
            console.log(e)
            if (e instanceof ClientResponseError) {
                // {"code":400,"message":"Something went wrong while processing your request.","data":{"password":{"code":"validation_length_out_of_range","message":"The length must be between 8 and 100."},"token":{"code":"validation_invalid_token","message":"Invalid or expired token."}}}

                // get the response data
                const userLoginError = (e.data as ClientResponseError).message;

                // map data into {field: error}
                const errorMap: { [key: string]: string } = {};


                let data = e.data as ClientResponseError;
                for (let key in data.data) {
                    if (!data.data.hasOwnProperty(key)) continue;

                    console.log(data.data[key])

                    if (data.data[key].code === "validation_invalid_token") {
                        errorMap.token = "Invalid token. Please request a new password reset link."
                        continue;
                    } else if (data.data[key].code === "validation_values_mismatch") {
                        errorMap.passwordConfirm = "Passwords do not match.";
                        continue;
                    }

                    errorMap[key] = data.data[key].message;
                }

                console.log(errorMap)

                if (errorMap.passwordConfirm) {
                    errorMap.form = errorMap.passwordConfirm;
                }

                // password is second most important error
                if (errorMap.password) {
                    errorMap.form = errorMap.password;
                }

                // token is the most important error (if it exists, as it means their token is invalid or expired)
                if (errorMap.token) {
                    errorMap.form = errorMap.token;
                }

                // set the errors
                setErrors({"form": userLoginError, ...errorMap});
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
            <form class="auth-form" onSubmit={loginToAccount}>
                <div class="auth-form-header">
                    <p>Reset Password</p>
                </div>
                <div class="auth-form-body">
                    <ValidatedInput value={password} valueUpdate={setPassword} name={"email"} label={"New Password"}
                                    errors={errors} type={"password"} required={true} />
                    <ValidatedInput value={passwordConfirm} valueUpdate={setPasswordConfirm} name={"email"} label={"Confirm New Password"}
                                    errors={errors} type={"password"} required={true} />
                </div>
                <div className="auth-form-footer">
                    <button className="auth-form-submit-button" type="submit" disabled={!loginEnabled}>
                        Reset Password
                    </button>
                    <div className="auth-form-submit-error">
                        {errors.form ? errors.form : ""}
                    </div>
                    <div className="auth-form-submit-success">
                        {message ? message : ""}
                    </div>

                    <p className="auth-form-text">Need a new link? <Link to={URLS.FORGOT_PASSWORD}
                                                                                class="auth-form-link">Forgot Password</Link></p>
                    <p className="auth-form-text">Remember your password? <Link to={URLS.LOGIN}
                                                                                class="auth-form-link">Login</Link></p>

                </div>
            </form>
        </Content>
    </Page>
}