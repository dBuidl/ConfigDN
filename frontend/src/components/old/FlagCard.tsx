import {FlagRecord, ValueRecordString} from "../../types/Structures";
import React, {useState} from "preact/compat";
import {fieldTypeToInputType} from "../../types/Conversions";
import {JSX} from "preact";
import {tPocketbaseAsyncResponse, tPocketbaseResponse} from "../../routes/Dashboards/Config";

export default function FlagCard(props: { flag: FlagRecord, originalValue: ValueRecordString, value: ValueRecordString, setValue: (values: ValueRecordString) => void, saveValue: (value: ValueRecordString) => tPocketbaseAsyncResponse }) {
    const [lastSaveStatus, setLastSaveStatus] = useState<tPocketbaseResponse | null>(null);
    const {flag, originalValue, value, setValue, saveValue} = props;
    // todo: need to fix originalValue

    const inputType = fieldTypeToInputType(flag.type);

    let input: JSX.Element;

    function save() {
        // todo: tell the user whether it was successful
        saveValue(value).then((status) => {
            setLastSaveStatus(status);

            setTimeout(() => setLastSaveStatus(null), 5000);
        })
    }

    switch (inputType) {
        case "text":
            input = <input type={inputType} value={value.value}
                           onInput={e => setValue({...value, value: e?.currentTarget?.value})}/>;
            break;
        case "number":
            input = <input type={inputType} value={value.value}
                           onInput={e => setValue({...value, value: e?.currentTarget?.value})}/>
            break;
        case "checkbox":
            input = <input type={inputType} checked={value.value === "true"}
                           onClick={e => setValue({...value, value: e?.currentTarget?.checked ? "true" : "false"})}/>
            break;
        case "textarea":
            input =
                <textarea value={value.value} onInput={e => setValue({
                    ...value,
                    value: e?.currentTarget?.value
                })}/>
    }

    const onReset = (e: Event) => {
        e.preventDefault();
        setValue(originalValue);
    }

    function getLastSaveStatusMessage() {
        if (lastSaveStatus === null) return null;

        if (lastSaveStatus[0] === 1) {
            return <p>Value saved successfully.</p>
        } else if (lastSaveStatus[0] === 0) {
            return <p>Failed to save value.</p>
        } else {
            return <p>{lastSaveStatus[1]}</p>
        }
    }

    return <div class="flag-card">
        <h2>{flag.name}</h2>
        <p>{flag.identifier}</p>
        {input}
        <button onClick={onReset} disabled={originalValue.value === value.value}>Reset</button>
        <button onClick={save} disabled={originalValue.value === value.value}>Save
        </button>
        {getLastSaveStatusMessage()}
    </div>;
}