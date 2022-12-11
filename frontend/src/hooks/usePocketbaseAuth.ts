// hook to get pocketbase auth data
import {useEffect, useState} from "preact/compat";
import pocketbase from "../libraries/Pocketbase";

export default function usePocketbaseAuth() {
    let [authStore, setAuthStore] = useState(pocketbase.authStore);

    useEffect(() => {
        if (pocketbase.authStore.isValid) {
            // check if the user is logged in
            pocketbase.collection('users').authRefresh().then(() => {
                // redirect to dashboard
                if (pocketbase.authStore.isValid) {
                    setAuthStore(pocketbase.authStore);
                }
            }).catch(() => {
                // todo: check how this should be handled
                setAuthStore(pocketbase.authStore);
            });
        }
    }, [pocketbase.authStore]);

    return authStore;
}