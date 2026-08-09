import {ComponentChildren} from "preact";

export default function NavBar(props: { logo: any, children: ComponentChildren }) {
    const isConfigDN = typeof window !== "undefined" && window.location.hostname === "configdn.com";
    const isSelfHosted = !isConfigDN;

    return <nav className="sticky top-0 z-40 flex min-h-20 items-center gap-5 border-b border-line/70 bg-ink/90 px-5 py-3 backdrop-blur-xl sm:px-8">
        <div className={isSelfHosted ? "flex shrink-0 flex-col" : "flex shrink-0 items-center gap-2"}>
            {!isSelfHosted && <img className="h-10 w-20 object-contain" src={props.logo} alt="ConfigDN"/>}
            <span className={`${isSelfHosted ? "" : "hidden sm:inline"} text-sm font-bold tracking-[-0.02em] text-copy`}>Config<span className="text-lime">D</span>N</span>
            {isSelfHosted && <span className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-muted">Self-Hosted Edition</span>}
        </div>
        {props.children}
    </nav>;
}
