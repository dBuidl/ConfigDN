import React from 'preact/compat';

export default function ErrorIfExists(props: { error?: string }) {
    // return the error if it exists
    if (typeof props.error !== "undefined" && props.error.length > 0) return <span
        className="error">{props.error}</span>;
    return null;
}