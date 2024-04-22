import {PropsWithChildren} from "preact/compat";

interface ContentPageProps extends PropsWithChildren {
    pageName?: string
}

export default function Content(props: ContentPageProps) {
    return <div className={`content ${props.pageName}`}>
        {props.children}
    </div>;
}