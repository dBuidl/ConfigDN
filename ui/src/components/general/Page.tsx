import {ComponentChild} from "preact";
import Footer from "./Footer";

export default function Page(props: { isShort?: boolean, class?: string, children: ComponentChild }) {
    return <div className={`relative flex min-h-screen flex-col overflow-x-hidden ${props.class ?? ""}`}>
        {props.children}
        <Footer />
    </div>
}
