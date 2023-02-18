import {PropsWithChildren} from "preact/compat";

export default function DialogOverlay(props: PropsWithChildren) {
    return <div className="dialog-overlay">
        {props.children}
    </div>;
}