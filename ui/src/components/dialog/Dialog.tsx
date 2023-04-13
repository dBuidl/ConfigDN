import {PropsWithChildren} from "preact/compat";

export default function Dialog(props: PropsWithChildren) {
    return <div className="dialog">
        {props.children}
    </div>;
}