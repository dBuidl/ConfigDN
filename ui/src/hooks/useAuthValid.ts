// hook to get pocketbase auth data
import {useEffect, useState} from "preact/compat";
import pocketbase from "../libraries/Pocketbase";
import {tNullableAuthModel, tValidAuthModelResponse} from "../types/Structures";

export default function useAuthValid() {
    let [isValid, setIsValid] = useState(pocketbase.authStore.isValid);

    useEffect(() => {
        return pocketbase.authStore.onChange(() => {
            setIsValid(pocketbase.authStore.isValid);
        });
    }, []);

    return isValid;
}

export function useAuthValidWithModel(): tValidAuthModelResponse {
    let [isValid, setIsValid] = useState(pocketbase.authStore.isValid);
    let [record, setRecord] = useState<tNullableAuthModel>(pocketbase.authStore.record);

    useEffect(() => {
        return pocketbase.authStore.onChange(() => {
            setIsValid(pocketbase.authStore.isValid);
            setRecord(pocketbase.authStore.record);
        });
    }, []);

    return [isValid, record] as tValidAuthModelResponse;
}
