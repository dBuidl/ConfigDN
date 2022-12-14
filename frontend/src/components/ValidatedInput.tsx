import React, {useEffect} from "preact/compat";

export default function ValidatedInput(props: { errors: { [key: string]: string }, name: string, type?: string, value: string, valueUpdate: (val: string) => void, id?: string, label?: string }) {
    const [error, setError] = React.useState("");
    const id = props.id || props.name;

    useEffect(() => {
        if (props.errors[props.name]) {
            setError(props.errors[props.name]);
        } else {
            setError("");
        }
    }, [props.errors]);

    function onChange(e: any) {
        e.preventDefault();
        e.stopPropagation();
        props.valueUpdate(e.target.value);
    }

    return <div className="form-input">
        <label htmlFor={id}>{props.label}</label>
        <input
            type={props.type || "text"}
            name={props.name}
            id={id}
            value={props.value}
            onChange={onChange}
            className={error ? "error" : ""}
        />
        {error.length > 0 ? <div className="error-message">Error: {error}</div> : null}
    </div>;

}