import React from "preact/compat";
import pocketbase from "../libraries/Pocketbase";
import {AuthMethodsList} from "pocketbase";
import ErrorsAsStringDict from "../helpers/ErrorsAsStringDict";
import URLS from "../helpers/URLS";
import useAuthRedirect from "../hooks/useAuthRedirect";
import {useLoaderData, useNavigate} from "react-router-dom";
import ValidatedInput from "../components/auth/ValidatedInput";
import logo from "../assets/images/raster/logo.png";
import NavBarLinksContainer from "../components/navbar/NavBarLinksContainer";
import NavAuthLinks from "../components/navbar/NavAuthLinks";
import NavBar from "../components/navbar/NavBar";
import Page from "../components/general/Page";
import Content from "../components/general/Content";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub} from "@fortawesome/free-brands-svg-icons/faGithub";
import loginWithOauth from "../helpers/loginWithOauth";

export default function Register() {
    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [passwordConfirm, setPasswordConfirm] = React.useState("");
    const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
    const [registerEnabled, setRegisterEnabled] = React.useState(true);
    const navigate = useNavigate();
    const oAuthData = useLoaderData() as AuthMethodsList;
    // redirect to dashboard if already authenticated
    useAuthRedirect(URLS.DASHBOARD, true);

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
            setErrors(ErrorsAsStringDict(e));
        }

        setRegisterEnabled(true);
    }

    return <Page className="auth-page">
        <NavBar logo={logo}>
            <NavBarLinksContainer>
                <NavAuthLinks/>
            </NavBarLinksContainer>
        </NavBar>

        <Content pageName="auth-content">
            <form className="auth-form" onSubmit={createAccount}>
                <div className="auth-form-header">
                    <p>Register</p>
                </div>
                <div className="auth-form-body">
                    <ValidatedInput value={username} valueUpdate={setUsername} name={"username"}
                                    label={"Username (optional)"}
                                    errors={errors}/>
                    <ValidatedInput value={email} valueUpdate={setEmail} name={"email"} label={"Email"} errors={errors}
                                    type={"email"}/>
                    <ValidatedInput value={password} valueUpdate={setPassword} name={"password"} label={"Password"}
                                    type={"password"} errors={errors}/>
                    <ValidatedInput value={passwordConfirm} valueUpdate={setPasswordConfirm} name={"passwordConfirm"}
                                    label={"Confirm Password"} type={"password"} errors={errors}/>
                </div>
                <div className="auth-form-footer">
                    <button className="auth-form-submit-button" type="submit" disabled={!registerEnabled}>Register</button>
                    <div className="auth-form-submit-error">
                        {errors.form ? errors.form : ""}
                    </div>

                    <div className="auth-form-oauth2">
                        <p>Or login with:</p>
                        <div className="auth-form-oauth2-buttons">
                            <button className="auth-form-oauth2-button" type="button"
                                    onClick={e => loginWithOauth(e, "github", oAuthData)}>
                                <FontAwesomeIcon icon={faGithub}/><p>GitHub</p>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </Content>
    </Page>
}

export function registerLoader() {
    return pocketbase.collection('users').listAuthMethods();
}