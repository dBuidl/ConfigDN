// hook to get pocketbase auth data
import {useEffect, useState} from "preact/compat";
import pocketbase from "../libraries/Pocketbase";
import {tNullableAuthModel, tValidAuthModelResponse} from "../types/Structures";

export default function useAuthValid() {
    let [isValid, setIsValid] = useState(pocketbase.authStore.isValid);

    useEffect(() => {
        return pocketbase.authStore.onChange((e) => {
            setIsValid(e.length > 0);
        });
    }, []);

    return isValid;
}

export function useAuthValidWithModel(): tValidAuthModelResponse {
    let [isValid, setIsValid] = useState(pocketbase.authStore.isValid);
    let [model, setModel] = useState<tNullableAuthModel>(pocketbase.authStore.model);

    useEffect(() => {
        return pocketbase.authStore.onChange((e, mod) => {
            setIsValid(e.length > 0);
            setModel(mod);
        });
    }, []);

    return [isValid, model] as tValidAuthModelResponse;
}