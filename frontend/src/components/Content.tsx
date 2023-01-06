import React from "preact/compat";

export function Content(props: any) {
    const {children, ...rest} = props;
    return <div className="content content-full" {...rest}>
        {children}
    </div>
}

export function ContentWithNavigation(props: any) {
    const {children, ...rest} = props;
    return <div className="content content-with-nav" {...rest}>
        {children}
    </div>
}

export function ContentNavigation(props: any) {
    const {children, ...rest} = props;
    return <div className="content-nav" {...rest}>
        {children}
    </div>
}