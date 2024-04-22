import {PropsWithChildren} from "preact/compat";

interface DialogOverlayProps extends PropsWithChildren {
    onClick?: (e: Event) => void;
}

export default function DialogOverlay(props: DialogOverlayProps) {
    return <div role={"button"} className="dialog-overlay" onClick={props.onClick ? props.onClick : () => null} onKeyDown={(e) => {if (e.key === "Enter" && props.onClick) {props.onClick(e);}}}>
        {props.children}
    </div>;
}