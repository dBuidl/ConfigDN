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
                emailVisibility: true,
            }).then(() => navigate(URLS.DASHBOARD)).catch((e) => navigate(URLS.LOGIN + "?error=" + e.message));
        }
    }, []);

    return <div>Please wait while we log you in...</div>;
}