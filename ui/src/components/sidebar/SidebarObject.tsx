import {ComponentChildren} from "preact";
import React from "preact/compat";
import {Link} from "react-router-dom";

export default function SidebarObject(props: { type: "team" | "project" | "config", url: string, name: string, children?: ComponentChildren }) {
    return <div className={`sidebar-${props.type}`}>

        <div className={`sidebar-${props.type}-details`}>
            <div className={`sidebar-${props.type}-decoration`}>
                <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 500 500">
                    <path d="M0,0 L0,500 L500,500 L500,0" fill="currentColor"/>
                </svg>
            </div>
            <Link to={props.url} className={`sidebar-${props.type}-text`}>{props.name}</Link>
        </div>

        {props.children}
    </div>;
}