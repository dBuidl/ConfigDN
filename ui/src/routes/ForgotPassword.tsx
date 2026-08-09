import React from "preact/compat";
import pocketbase from "../libraries/Pocketbase";
import {Link} from "react-router-dom";
import URLS from "../helpers/URLS";
import ValidatedInput from "../components/auth/ValidatedInput";
import useAuthRedirect from "../hooks/useAuthRedirect";
import NavBarLinksContainer from "../components/navbar/NavBarLinksContainer";
import NavAuthLinks from "../components/navbar/NavAuthLinks";
import NavBar from "../components/navbar/NavBar";
import Content from "../components/general/Content";
import Page from "../components/general/Page";
import {tWebMailAPIResponse} from "../types/Structures";
import ErrorsAsStringDict from "../helpers/ErrorsAsStringDict";
import configdnMark from "../assets/images/vector/configdn-mark.svg";

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
            <NavBar logo={configdnMark}>
            <NavBarLinksContainer>
                <NavAuthLinks/>
            </NavBarLinksContainer>
        </NavBar>

        <Content pageName="auth-content">
            <form className="w-full max-w-md overflow-hidden rounded-3xl border border-line bg-panel/90 shadow-[0_24px_80px_rgba(0,0,0,0.25)]" onSubmit={loginToAccount}>
                <div className="border-b border-line/70 px-7 pb-5 pt-7">
                    <span className="mb-4 block font-mono text-[0.65rem] font-bold tracking-[0.2em] text-lime">ACCOUNT RECOVERY</span>
                    <p className="text-3xl font-semibold tracking-[-0.04em] text-copy">Forgot Password?</p>
                </div>
                <div className="space-y-4 px-7 pt-6">
                    <ValidatedInput value={email} valueUpdate={setEmail} name={"email"} label={"Email"}
                                    errors={errors} type={"email"} required={true} />
                </div>
                <div className="flex flex-col items-stretch gap-3 px-7 pb-7 pt-6">
                    <button className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl border border-lime bg-lime px-4 font-bold text-ink transition hover:bg-transparent hover:text-lime disabled:cursor-not-allowed disabled:opacity-50" type="submit" disabled={!loginEnabled}>Send Password
                        Reset
                    </button>
                    <div className="text-sm text-red">
                        {errors.form ? errors.form : ""}
                    </div>
                    <div className="rounded-xl border border-lime/20 bg-lime/10 px-3 py-2 text-sm text-lime">
                        {message ? message : ""}
                    </div>

                    <button style={!wasSuccessful || webMailUrl === "" ? {display: "none"} : {}} onClick={() => window.open(webMailUrl, "_blank") && false} className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl border border-cyan bg-transparent px-4 font-bold text-cyan hover:bg-cyan hover:text-ink">
                        Click here to open your {webMailProvider ? webMailProvider + ""  : "email"} inbox.
                    </button>

                    <p className="text-center text-sm text-muted">Remember your password? <Link to={URLS.LOGIN}
                                                                                 className="font-semibold text-cyan underline decoration-cyan/30 underline-offset-4 hover:text-lime">Login</Link></p>
                    <p className="text-center text-sm text-muted">Need an account? <Link to={URLS.REGISTER}
                                                                          className="font-semibold text-cyan underline decoration-cyan/30 underline-offset-4 hover:text-lime">Register</Link></p>

                </div>
            </form>
        </Content>
    </Page>
}
