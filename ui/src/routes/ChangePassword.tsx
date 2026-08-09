import React from "preact/compat";
import pocketbase from "../libraries/Pocketbase";
import {Link, useNavigate} from "react-router-dom";
import URLS from "../helpers/URLS";
import ValidatedInput from "../components/auth/ValidatedInput";
import useAuthRedirect from "../hooks/useAuthRedirect";
import NavBarLinksContainer from "../components/navbar/NavBarLinksContainer";
import NavAuthLinks from "../components/navbar/NavAuthLinks";
import NavBar from "../components/navbar/NavBar";
import Content from "../components/general/Content";
import Page from "../components/general/Page";
import ErrorsAsStringDict from "../helpers/ErrorsAsStringDict";
import {useAuthValidWithModel} from "../hooks/useAuthValid";
import configdnMark from "../assets/images/vector/configdn-mark.svg";

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
            <NavBar logo={configdnMark}>
            <NavBarLinksContainer>
                <NavAuthLinks/>
            </NavBarLinksContainer>
        </NavBar>

        <Content pageName="auth-content">
            <form className="w-full max-w-md overflow-hidden rounded-3xl border border-line bg-panel/90 shadow-[0_24px_80px_rgba(0,0,0,0.25)]" onSubmit={loginToAccount}>
                <div className="border-b border-line/70 px-7 pb-5 pt-7">
                    <span className="mb-4 block font-mono text-[0.65rem] font-bold tracking-[0.2em] text-lime">ACCOUNT SETTINGS</span>
                    <p className="text-3xl font-semibold tracking-[-0.04em] text-copy">Change Password</p>
                </div>
                <div className="space-y-4 px-7 pt-6">
                    <ValidatedInput value={oldPassword} valueUpdate={setOldPassword} name={"oldPassword"} label={"Old Password"}
                                    errors={errors} type={"password"} required={true} />
                    <ValidatedInput value={password} valueUpdate={setPassword} name={"password"} label={"New Password"}
                                    errors={errors} type={"password"} required={true} />
                    <ValidatedInput value={passwordConfirm} valueUpdate={setPasswordConfirm} name={"passwordConfirm"} label={"Confirm New Password"}
                                    errors={errors} type={"password"} required={true} />
                </div>
                <div className="flex flex-col items-stretch gap-3 px-7 pb-7 pt-6">
                    <button className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl border border-lime bg-lime px-4 font-bold text-ink transition hover:bg-transparent hover:text-lime disabled:cursor-not-allowed disabled:opacity-50" type="submit" disabled={!loginEnabled}>
                        Reset Password
                    </button>
                    <div className="text-sm text-red">
                        {errors.form ? errors.form : ""}
                        {errors.token ? errors.token : ""}
                    </div>
                    <div className="rounded-xl border border-lime/20 bg-lime/10 px-3 py-2 text-sm text-lime">
                        {message ? message : ""}
                    </div>

                    <p className="text-center text-sm text-muted">Want to go back? <Link to={URLS.USER_SETTINGS}
                                                                                 className="font-semibold text-cyan underline decoration-cyan/30 underline-offset-4 hover:text-lime">Account Settings</Link></p>

                </div>
            </form>
        </Content>
    </Page>
}
