import {PropsWithChildren} from "preact/compat";

interface ContentPageProps extends PropsWithChildren {
    pageName?: string
}

export default function Content(props: ContentPageProps) {
    const pageName = props.pageName ?? "";
    const layout = pageName.includes("auth")
        ? "flex w-full flex-1 items-center justify-center bg-[radial-gradient(circle_at_50%_20%,rgba(185,243,107,0.08),transparent_24rem)] px-5 py-12 sm:px-8"
        : pageName.includes("error")
            ? "flex w-full flex-1 flex-col items-center justify-center px-6 text-center"
        : pageName.includes("homepage")
            ? "mx-auto w-full max-w-7xl flex-1 px-6 pb-24 pt-14 sm:px-10 lg:px-14"
            : "mx-auto w-full max-w-[1400px] flex-1 px-5 py-8 sm:px-8 lg:px-10";

    return <div className={`${layout} ${pageName}`}>
        {props.children}
    </div>;
}
