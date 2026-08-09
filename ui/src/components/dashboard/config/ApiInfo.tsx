import {useState} from "preact/compat";

export default function ApiInfo(props: { apiKey: string, config?: string, environment?: string }) {
    const [language, setLanguage] = useState("go");

    const codeSnippets = {
        go: `let configDN = new ConfigDN("${props.apiKey}");`,
        javascript: `let configDN = new ConfigDN("${props.apiKey}");`
    }


    return <div className="mt-10 rounded-3xl border border-line bg-panel p-5 sm:p-7">
        <h1 className="text-2xl font-semibold tracking-tight text-copy">Accessing this config</h1>
        <div>
            <p className="mb-2 mt-6 text-xs font-bold uppercase tracking-[0.14em] text-cyan">API Key ({props.config}, {props.environment} Environment)</p>
            <p className="overflow-x-auto rounded-xl border border-line bg-ink p-4 font-mono text-sm text-lime">{props.apiKey}</p>
        </div>

        <h2 className="mb-2 mt-6 text-xs font-bold uppercase tracking-[0.14em] text-cyan">Integrations</h2>
        <div className="mb-2 flex gap-2">
            <button className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-semibold ${language === "go" ? "border-cyan bg-cyan/10 text-cyan" : "border-line bg-transparent text-muted hover:text-copy"}`}
                    onClick={() => setLanguage("go")}>Go
            </button>
            <button className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-semibold ${language === "javascript" ? "border-cyan bg-cyan/10 text-cyan" : "border-line bg-transparent text-muted hover:text-copy"}`}
                    onClick={() => setLanguage("javascript")}>JavaScript
            </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-line bg-ink p-4 font-mono text-sm text-lime">
            {/* @ts-ignore */}
            <pre>{codeSnippets[language]}</pre>
        </div>
    </div>;
}
