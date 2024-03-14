import React, {useEffect} from "preact/compat";

export default function ValidatedInput(props: { errors: { [key: string]: string }, name: string, type?: string, value: string, valueUpdate: (val: string) => void, id?: string, label?: string, required?: boolean }) {
    const [error, setError] = React.useState("");
    const id = props.id || props.name;

    useEffect(() => {
        if (props.errors[props.name]) {
            setError(props.errors[props.name]);
        } else {
            setError("");
        }
    }, [props.errors]);

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        e.stopPropagation();
        props.valueUpdate(e.currentTarget.value);
    }

    return <div className="auth-form-input">
        <label class="auth-form-input-label" htmlFor={id}>{props.label}</label>
        <input
            type={props.type || "text"}
            name={props.name}
            id={id}
            value={props.value}
            required={props.required || false}
            onChange={onChange}
            className={`auth-form-input-field ${error ? "error" : ""}`}
        />
        {error.length > 0 ? <div className="auth-form-input-error">{error}</div> : null}
    </div>;

}