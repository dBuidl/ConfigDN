import store from "store/dist/store.modern";
import URLS from "./URLS";
import {AuthMethodsList} from "pocketbase";

export default function loginWithOauth(e: Event, providerName: string, oAuthData: AuthMethodsList) {
    e.preventDefault();

    for (let i = 0; i < oAuthData.authProviders.length; i++) {
        const provider = oAuthData.authProviders[i];
        if (provider.name === providerName) {
            store.set("provider", provider);
            const redirectUrl = location.origin + URLS.OAUTH2_REDIRECT;

            window.location.href = provider.authUrl + redirectUrl;
            break;
        }
    }
}