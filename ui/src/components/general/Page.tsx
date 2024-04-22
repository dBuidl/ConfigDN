import {ComponentChild} from "preact";

export default function Page(props: { isShort?: boolean, class?: string, children: ComponentChild }) {
    return <div className={`page ${props.isShort ? "page--shorter" : ""} ${props.class}`}>
        {props.children}
    </div>
}