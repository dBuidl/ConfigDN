import {ComponentChildren} from "preact";

export default function NavBar(props: { logo: any, children: ComponentChildren, className?: string }) {
    const isConfigDN = typeof window !== "undefined" && window.location.hostname === "configdn.com";
    const isSelfHosted = !isConfigDN;

    return <nav className={`sticky top-0 z-40 flex min-h-16 items-center gap-3 border-b border-line/70 dark:border-dark-line/70 bg-ink/90 dark:bg-dark-ink/90 px-4 py-2 backdrop-blur-xl sm:min-h-20 sm:gap-5 sm:px-8 sm:py-3 ${props.className ?? ""}`}>
        <div className={isSelfHosted ? "flex shrink-0 flex-col" : "flex shrink-0 items-center gap-2"}>
            {!isSelfHosted && <img className="h-10 w-20 object-contain" src={props.logo} alt="ConfigDN"/>}
            <span className={`${isSelfHosted ? "" : "hidden sm:inline"} text-sm font-bold tracking-[-0.02em] text-copy`}>Config<span className="text-lime">D</span>N</span>
            {isSelfHosted && <span className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-muted">Self-Hosted Edition</span>}
        </div>
        {props.children}
    </nav>;
}
