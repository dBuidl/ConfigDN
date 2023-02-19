import {PropsWithChildren} from "preact/compat";

interface DialogOverlayProps extends PropsWithChildren {
    onClick?: (e: Event) => void;
}

export default function DialogOverlay(props: DialogOverlayProps) {
    return <div className="dialog-overlay" onClick={props.onClick ? props.onClick : () => null}>
        {props.children}
    </div>;
}