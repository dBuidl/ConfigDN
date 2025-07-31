import React, {useEffect} from "preact/compat";
import pocketbase from "../libraries/Pocketbase";
import {AuthMethodsList} from "pocketbase";
import {Link, useLoaderData, useNavigate, useSearchParams} from "react-router-dom";
import URLS from "../helpers/URLS";
import ValidatedInput from "../components/auth/ValidatedInput";
import useAuthRedirect from "../hooks/useAuthRedirect";
import logo from "../assets/images/raster/logo.png";
import NavBarLinksContainer from "../components/navbar/NavBarLinksContainer";
import NavAuthLinks from "../components/navbar/NavAuthLinks";
import NavBar from "../components/navbar/NavBar";
import Content from "../components/general/Content";
import Page from "../components/general/Page";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub} from "@fortawesome/free-brands-svg-icons/faGithub";
import loginWithOauth from "../helpers/loginWithOauth";
import ErrorsAsStringDict from "../helpers/ErrorsAsStringDict";

export default function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
    const [loginEnabled, setLoginEnabled] = React.useState(true);
    const navigate = useNavigate();
    const [params] = useSearchParams();
    // redirect to dashboard if already authenticated
    useAuthRedirect(URLS.DASHBOARD, true);
    const oAuthData = useLoaderData() as AuthMethodsList;

    useEffect(() => {
        const err = params.get("error");
        if (err !== null) {
            setErrors({"form": err});
        }
    }, []);

    async function loginToAccount(e: Event) {
        e.preventDefault();
        setLoginEnabled(false);

        try {
            await pocketbase.collection('users').authWithPassword(email, password);

            setErrors({});

            navigate(URLS.DASHBOARD);
        } catch (e) {
            setErrors(ErrorsAsStringDict(e as any));
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
                <div className="auth-form-body">
                    <ValidatedInput value={email} valueUpdate={setEmail} name={"email"} label={"Username or Email"}
                                    errors={errors}/>
                    <ValidatedInput value={password} valueUpdate={setPassword} name={"password"} label={"Password"}
                                    errors={errors} type={"password"}/>
                </div>
                <div className="auth-form-footer">
                    <button className="auth-form-submit-button" type="submit" disabled={!loginEnabled}>Login</button>
                    <div className="auth-form-submit-error">
                        {errors.form ? errors.form : ""}
                    </div>

                    <Link className="auth-form-link" to={URLS.FORGOT_PASSWORD}>Forgot Password?</Link>

                    <div className="auth-form-oauth2">
                        <p>Or login with:</p>
                        <div className="auth-form-oauth2-buttons">
                            <button className="auth-form-oauth2-button" type="button"
                                    onClick={e => loginWithOauth(e, "github", oAuthData)} disabled={!loginEnabled}>
                                <FontAwesomeIcon icon={faGithub}/><p>GitHub</p>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </Content>
    </Page>
}

export function loginLoader() {
    return pocketbase.collection('users').listAuthMethods();
}