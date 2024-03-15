import React from "preact/compat";
import pocketbase from "../libraries/Pocketbase";
import {Link, useNavigate} from "react-router-dom";
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
import {useAuthValidWithModel} from "../hooks/useAuthValid";

export default function ChangePassword() {
    const [oldPassword, setOldPassword] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [passwordConfirm, setPasswordConfirm] = React.useState("");
    const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
    const [message, setMessage] = React.useState("");
    const [loginEnabled, setLoginEnabled] = React.useState(true);
    // redirect to dashboard if already authenticated
    useAuthRedirect(URLS.DASHBOARD, false);

    const [,model] = useAuthValidWithModel();
    const navigate = useNavigate();

    async function loginToAccount(e: Event) {
        e.preventDefault();
        setLoginEnabled(false);

        try {
            // change password
            if (!model) {
                return;
            }
            await pocketbase.collection('users').update(model.id, {
                oldPassword,
                password,
                passwordConfirm,
            });

            // we must re-authenticate the user now otherwise they can't do anything
            await pocketbase.collection('users').authWithPassword(model.email, password);

            setErrors({});
            setMessage("Your password has been changed successfully.");

            setTimeout(() => {
                // check we haven't changed pages since calling this
                if (window.location.pathname === URLS.CHANGE_PASSWORD) {
                    navigate(URLS.DASHBOARD);
                }
            }, 5000);
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
                    <p>Reset Password</p>
                </div>
                <div class="auth-form-body">
                    <ValidatedInput value={oldPassword} valueUpdate={setOldPassword} name={"oldPassword"} label={"Old Password"}
                                    errors={errors} type={"password"} required={true} />
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

                    <p className="auth-form-text">Want to go back? <Link to={URLS.DASHBOARD}
                                                                                class="auth-form-link">Dashboard</Link></p>

                </div>
            </form>
        </Content>
    </Page>
}