import React, {useEffect} from "preact/compat";
import pocketbase from "../libraries/Pocketbase";
import {AuthMethodsList} from "pocketbase";
import {Link, useLoaderData, useNavigate, useSearchParams} from "react-router-dom";
import URLS from "../helpers/URLS";
import ValidatedInput from "../components/auth/ValidatedInput";
import useAuthRedirect from "../hooks/useAuthRedirect";
import NavBarLinksContainer from "../components/navbar/NavBarLinksContainer";
import NavAuthLinks from "../components/navbar/NavAuthLinks";
import NavBar from "../components/navbar/NavBar";
import Content from "../components/general/Content";
import Page from "../components/general/Page";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub} from "@fortawesome/free-brands-svg-icons/faGithub";
import loginWithOauth from "../helpers/loginWithOauth";
import ErrorsAsStringDict from "../helpers/ErrorsAsStringDict";
import configdnMark from "../assets/images/vector/configdn-mark.svg";

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
            <NavBar logo={configdnMark}>
            <NavBarLinksContainer>
                <NavAuthLinks/>
            </NavBarLinksContainer>
        </NavBar>

        <Content pageName="auth-content">
            <form className="w-full max-w-md overflow-hidden rounded-3xl border border-line bg-panel/90 shadow-[0_24px_80px_rgba(0,0,0,0.25)]" onSubmit={loginToAccount}>
                <div className="border-b border-line/70 px-7 pb-5 pt-7">
                    <span className="mb-4 block font-mono text-[0.65rem] font-bold tracking-[0.2em] text-lime">ACCESS / CONFIGDN</span>
                    <p className="text-3xl font-semibold tracking-[-0.04em] text-copy">Login</p>
                </div>
                <div className="space-y-4 px-7 pt-6">
                    <ValidatedInput value={email} valueUpdate={setEmail} name={"email"} label={"Username or Email"}
                                    errors={errors}/>
                    <ValidatedInput value={password} valueUpdate={setPassword} name={"password"} label={"Password"}
                                    errors={errors} type={"password"}/>
                </div>
                <div className="flex flex-col items-stretch gap-3 px-7 pb-7 pt-6">
                    <button className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl border border-lime bg-lime px-4 font-bold text-ink transition hover:bg-transparent hover:text-lime disabled:cursor-not-allowed disabled:opacity-50" type="submit" disabled={!loginEnabled}>Login</button>
                    <div className="text-sm text-red">
                        {errors.form ? errors.form : ""}
                    </div>

                    <Link className="text-center text-sm font-semibold text-cyan underline decoration-cyan/30 underline-offset-4 hover:text-lime" to={URLS.FORGOT_PASSWORD}>Forgot Password?</Link>

                    <div className="mt-2 border-t border-line/70 pt-5 text-center text-sm text-muted">
                        <p>Or login with:</p>
                        <div className="mt-3">
                            <button className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-line bg-ink px-4 py-3 font-semibold text-copy hover:border-cyan hover:text-cyan" type="button"
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
