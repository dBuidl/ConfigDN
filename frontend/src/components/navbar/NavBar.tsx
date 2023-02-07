import {ComponentChildren} from "preact";

export default function NavBar(props: { logo: any, children: ComponentChildren }) {
    return <nav className="navbar">
        <div className="navbar-brand">
            <div className="navbar-logo">
                <img src={props.logo} alt="ConfigDN"/>
            </div>
        </div>
        {props.children}
    </nav>;
}