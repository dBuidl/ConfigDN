import {FlagRecord, ValueRecord} from "../types/Structures";
import React from "preact/compat";
import {fieldTypeToInputType} from "../types/Conversions";
import {JSX} from "preact";

export default function FlagCard(props: { flag: FlagRecord, originalValue: ValueRecord, value: ValueRecord, setValue: (values: ValueRecord) => void }) {
    const {flag, originalValue, value, setValue} = props;
    // todo: need to fix originalValue

    const inputType = fieldTypeToInputType(flag.type);

    let input: JSX.Element;

    switch (inputType) {
        case "text":
            input = <input type={inputType} value={JSON.stringify(value.value)}
                           onInput={e => setValue({...value, value: JSON.parse(e?.currentTarget?.value)})}/>;
            break;
        case "number":
            input = <input type={inputType} value={JSON.stringify(value.value)}
                           onInput={e => setValue({...value, value: JSON.parse(e?.currentTarget?.value)})}/>
            break;
        case "checkbox":
            input = <input type={inputType} checked={JSON.stringify(value.value) === "yes"}
                           onClick={e => setValue({...value, value: e?.currentTarget?.checked ? "yes" : "no"})}/>
            break;
        case "textarea":
            input =
                <textarea onInput={e => setValue({
                    ...value,
                    value: e?.currentTarget?.value
                })}>{JSON.stringify(value.value)}</textarea>
    }

    return <div class="flag-card">
        <h2>{flag.name}</h2>
        <p>{flag.identifier}</p>
        {input}
        <button onClick={() => setValue(originalValue)}>Reset</button>
        <button>Save</button>
    </div>;
}