import React from "preact/compat";
import pocketbase from "../libraries/Pocketbase";
import {AuthMethodsList} from "pocketbase";
import ErrorsAsStringDict from "../helpers/ErrorsAsStringDict";
import URLS from "../helpers/URLS";
import useAuthRedirect from "../hooks/useAuthRedirect";
import {useLoaderData, useNavigate} from "react-router-dom";
import ValidatedInput from "../components/auth/ValidatedInput";
import NavBarLinksContainer from "../components/navbar/NavBarLinksContainer";
import NavAuthLinks from "../components/navbar/NavAuthLinks";
import NavBar from "../components/navbar/NavBar";
import Page from "../components/general/Page";
import Content from "../components/general/Content";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub} from "@fortawesome/free-brands-svg-icons/faGithub";
import loginWithOauth from "../helpers/loginWithOauth";
import configdnMark from "../assets/images/vector/configdn-mark.svg";

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

    return <Page class="auth-page">
            <NavBar logo={configdnMark}>
            <NavBarLinksContainer>
                <NavAuthLinks/>
            </NavBarLinksContainer>
        </NavBar>

        <Content pageName="auth-content">
            <form className="w-full max-w-md overflow-hidden rounded-3xl border border-line bg-panel/90 shadow-[0_24px_80px_rgba(0,0,0,0.25)]" onSubmit={createAccount}>
                <div className="border-b border-line/70 px-7 pb-5 pt-7">
                    <span className="mb-4 block font-mono text-[0.65rem] font-bold tracking-[0.2em] text-lime">ACCESS / CONFIGDN</span>
                    <p className="text-3xl font-semibold tracking-[-0.04em] text-copy">Register</p>
                </div>
                <div className="space-y-4 px-7 pt-6">
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
                <div className="flex flex-col items-stretch gap-3 px-7 pb-7 pt-6">
                    <button className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl border border-lime bg-lime px-4 font-bold text-ink transition hover:bg-transparent hover:text-lime disabled:cursor-not-allowed disabled:opacity-50" type="submit" disabled={!registerEnabled}>Register</button>
                    <div className="text-sm text-red">
                        {errors.form ? errors.form : ""}
                    </div>

                    <div className="mt-2 border-t border-line/70 pt-5 text-center text-sm text-muted">
                        <p>Or login with:</p>
                        <div className="mt-3">
                            <button className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-line bg-ink px-4 py-3 font-semibold text-copy hover:border-cyan hover:text-cyan" type="button"
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
