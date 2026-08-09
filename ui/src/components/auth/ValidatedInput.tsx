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

    return <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-[0.13em] text-muted" htmlFor={id}>{props.label}</label>
        <input
            type={props.type || "text"}
            name={props.name}
            id={id}
            value={props.value}
            required={props.required || false}
            onChange={onChange}
            className={`w-full rounded-xl border bg-ink/70 px-4 py-3 text-copy outline-none transition placeholder:text-muted/60 focus:border-cyan focus:ring-4 focus:ring-cyan/10 ${error ? "border-red focus:border-red focus:ring-red/10" : "border-line"}`}
        />
        {error.length > 0 ? <div className="text-sm text-red">{error}</div> : null}
    </div>;

}
