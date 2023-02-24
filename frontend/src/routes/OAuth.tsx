import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect} from "preact/compat";
import store from "store/dist/store.modern";
import URLS from "../helpers/URLS";
import pocketbase from "../libraries/Pocketbase";

export default function OAuth() {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const code = params.get("code");
        const provider = store.get("provider");
        const redirectUrl = location.origin + URLS.OAUTH2_REDIRECT;

        if (provider.state !== params.get("state")) {
            navigate(URLS.LOGIN + "?error=Could not verify state, please try to login again.");
        }

        if (code) {
            pocketbase.collection('users').authWithOAuth2(provider.name, code, provider.codeVerifier, redirectUrl, {
                emailVisibility: false,
            }).then(async data => {
                // Try and set a sensible username and display name for the user (otherwise they get ugly names like "user123456")
                pocketbase.collection('users').update(data.record.id, {
                    name: data.meta?.name ?? "",
                    username: data.meta?.username.replace(/\W/g, "") ?? "",
                }).catch(e => console.error(e));

                navigate(URLS.DASHBOARD)
            }).catch((e) => navigate(URLS.LOGIN + "?error=" + e.message));
        }
    }, []);

    return <div>Please wait while we log you in...</div>;
}