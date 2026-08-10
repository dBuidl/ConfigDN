import {ComponentChildren} from "preact";
import React from "preact/compat";
import {Link} from "react-router-dom";

export default function SidebarObject(props: { type: "team" | "project" | "config", url: string, name: string, children?: ComponentChildren, onNavigate?: () => void }) {
    const indent = props.type === "team" ? "" : props.type === "project" ? "ml-3" : "ml-6";
    const color = props.type === "team" ? "bg-lime" : props.type === "project" ? "bg-cyan" : "bg-amber";

    return <div>

        <div className={`flex items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-panel dark:hover:bg-dark-panel ${indent}`}>
            <div className={`h-2 w-2 shrink-0 rounded-full ${color}`}/>
            <Link to={props.url} onClick={props.onNavigate} className={`min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold ${props.type === "team" ? "text-copy" : "text-muted"}`}>{props.name}</Link>
        </div>

        {props.children}
    </div>;
}
