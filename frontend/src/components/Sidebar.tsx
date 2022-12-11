import React from "preact/compat";
import "../styles/sidebar.scss";

export default function Sidebar(props: any) {
    console.log(props);
    return <div className="sidebar">
        <div class="sidebar-header">
            <p>status info here</p>
        </div>
    </div>;
}