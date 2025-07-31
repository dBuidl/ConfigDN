import {ComponentChild} from "preact";
import Footer from "./Footer";

export default function Page(props: { isShort?: boolean, class?: string, children: ComponentChild }) {
    return <div className={`page ${props.isShort ? "page--shorter" : ""} ${props.class}`}>
        {props.children}
        <Footer />
    </div>
}