import {ComponentChildren} from "preact";

export default function NavBar(props: { logo: any, children: ComponentChildren }) {
    return <nav className="sticky top-0 z-40 flex min-h-20 items-center gap-5 border-b border-line/70 bg-ink/90 px-5 py-3 backdrop-blur-xl sm:px-8">
        <div className="flex shrink-0 items-center gap-2">
            <img className="h-10 w-20 object-contain" src={props.logo} alt="ConfigDN"/>
            <span className="hidden text-sm font-bold tracking-[-0.02em] text-copy sm:inline">Config<span className="text-lime">D</span>N</span>
        </div>
        {props.children}
    </nav>;
}
