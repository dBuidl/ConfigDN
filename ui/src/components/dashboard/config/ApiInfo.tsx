import {useState} from "preact/compat";

type IntegrationLanguage = "go" | "javascript" | "openfeature";

export default function ApiInfo(props: { apiKey: string, config?: string, environment?: string }) {
    const [language, setLanguage] = useState<IntegrationLanguage>("go");

    const codeSnippets: Record<IntegrationLanguage, string> = {
        go: `package main

import (
    "fmt"
    "log"

    configdn "github.com/dBuidl/ConfigDN-client-go"
)

func main() {
    client, err := configdn.NewConfigDN("${props.apiKey}")
    if err != nil {
        log.Fatal(err)
    }

    enabled := client.Get("YOUR_FLAG_IDENTIFIER")
    fmt.Printf("enabled=%v\\n", enabled)
}`,
        javascript: `import { ConfigDN } from "configdn-js";

const configDN = new ConfigDN("${props.apiKey}");
const enabled = await configDN.get("YOUR_FLAG_IDENTIFIER", false);

console.log("enabled:", enabled);`,
        openfeature: `import { OpenFeature } from "@openfeature/web-sdk";
import { ConfigDNProvider } from "@configdn/openfeature-provider";

const provider = new ConfigDNProvider("${props.apiKey}");
await OpenFeature.setProviderAndWait(provider);

const client = OpenFeature.getClient();
const enabled = await client.getBooleanValue(
  "YOUR_FLAG_IDENTIFIER",
  false,
);

console.log("enabled:", enabled);`
    };
    const isJavaScript = language !== "go";
    const installationCommand = language === "openfeature"
        ? "npm install @configdn/openfeature-provider @openfeature/web-sdk configdn-js"
        : "npm install configdn-js";

    return <div className="mt-10 rounded-3xl border border-line bg-panel p-5 sm:p-7">
        <h1 className="text-2xl font-semibold tracking-tight text-copy">Accessing this config</h1>
        <div>
            <p className="mb-2 mt-6 text-xs font-bold uppercase tracking-[0.14em] text-cyan">API Key ({props.config}, {props.environment} Environment)</p>
            <p className="overflow-x-auto rounded-xl border border-line bg-ink p-4 font-mono text-sm text-lime">{props.apiKey}</p>
        </div>

        <h2 className="mb-2 mt-6 text-xs font-bold uppercase tracking-[0.14em] text-cyan">Integrations</h2>
        <div className="mb-3 flex flex-wrap items-start gap-2">
            <button type="button" className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-semibold ${language === "go" ? "border-cyan bg-cyan/10 text-cyan" : "border-line bg-transparent text-muted hover:text-copy"}`}
                    onClick={() => setLanguage("go")}>Go
            </button>
            <div className="flex flex-col items-start gap-1">
                <button type="button" className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-semibold ${isJavaScript ? "border-cyan bg-cyan/10 text-cyan" : "border-line bg-transparent text-muted hover:text-copy"}`}
                        onClick={() => setLanguage("javascript")}>JavaScript
                </button>
                {isJavaScript && <div className="ml-3 flex gap-1 border-l border-line pl-3">
                    <button type="button" className={`cursor-pointer rounded-md border px-2.5 py-1 text-[0.7rem] font-semibold ${language === "javascript" ? "border-cyan/70 text-cyan" : "border-line text-muted hover:text-copy"}`}
                            onClick={() => setLanguage("javascript")}>ConfigDN client
                    </button>
                    <button type="button" className={`cursor-pointer rounded-md border px-2.5 py-1 text-[0.7rem] font-semibold ${language === "openfeature" ? "border-cyan/70 text-cyan" : "border-line text-muted hover:text-copy"}`}
                            onClick={() => setLanguage("openfeature")}>OpenFeature
                    </button>
                </div>}
            </div>
        </div>

        {isJavaScript && <div className="mb-3 overflow-x-auto rounded-xl border border-line/70 bg-ink/60 px-4 py-3 font-mono text-xs text-muted">
            <span className="mr-3 font-sans font-bold uppercase tracking-[0.12em] text-cyan">Install</span>
            <code>{installationCommand}</code>
        </div>}

        <div className="overflow-x-auto rounded-xl border border-line bg-ink p-4 font-mono text-sm text-lime">
            <pre>{codeSnippets[language]}</pre>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="text-muted">Client references:</span>
            <a className="font-semibold text-cyan hover:text-lime" href="https://github.com/dBuidl/ConfigDN-client-go" target="_blank" rel="noreferrer">Go client</a>
            <a className="font-semibold text-cyan hover:text-lime" href="https://github.com/dBuidl/ConfigDN-client-js" target="_blank" rel="noreferrer">JavaScript client</a>
            <a className="font-semibold text-cyan hover:text-lime" href="https://github.com/dBuidl/configdn-openfeature-provider-js" target="_blank" rel="noreferrer">OpenFeature provider</a>
        </div>
    </div>;
}
