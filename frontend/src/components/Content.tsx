import React from "preact/compat";

export function Content(props: any) {
    const {children, class: _class, ...rest} = props;
    return <div className={`content content-full ${_class}`} {...rest}>
        {children}
    </div>
}

export function ContentWithNavigation(props: any) {
    const {children, class: _class, ...rest} = props;
    return <div className={`content content-with-nav ${_class}`} {...rest}>
        {children}
    </div>
}

export function ContentNavigation(props: any) {
    const {children, class: _class, ...rest} = props;
    return <div className={`content-nav ${_class}`} {...rest}>
        {children}
    </div>
}