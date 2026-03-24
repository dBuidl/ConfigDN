import store from "store/dist/store.modern";
import URLS from "./URLS";
import {AuthMethodsList} from "pocketbase";

export default function loginWithOauth(e: Event, providerName: string, oAuthData: AuthMethodsList) {
    e.preventDefault();

    for (let i = 0; i < oAuthData.oauth2.providers.length; i++) {
        const provider = oAuthData.oauth2.providers[i];
        if (provider.name === providerName) {
            store.set("provider", provider);
            const redirectUrl = location.origin + URLS.OAUTH2_REDIRECT;

            window.location.href = provider.authURL + redirectUrl;
            break;
        }
    }
}