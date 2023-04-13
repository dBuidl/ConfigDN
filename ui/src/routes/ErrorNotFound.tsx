import React from "preact/compat";
import Content from "../components/general/Content";

export default function ErrorNotFound() {
    return <Content pageName="error-not-found">
        <h1>404</h1>
        <p>Page not found</p>
    </Content>;
}