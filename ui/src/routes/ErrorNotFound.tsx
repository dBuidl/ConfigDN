import React from "preact/compat";
import Content from "../components/general/Content";

export default function ErrorNotFound() {
    return <Content pageName="error-not-found flex flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan">Route not found</p>
        <h1 className="mt-3 text-8xl font-bold tracking-[-0.08em] text-lime">404</h1>
        <p className="mt-2 text-muted">Page not found</p>
    </Content>;
}
