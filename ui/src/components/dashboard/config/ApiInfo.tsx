import {useState} from "preact/compat";

export default function ApiInfo(props: { apiKey: string, config?: string, environment?: string }) {
    const [language, setLanguage] = useState("go");

    const codeSnippets = {
        go: `let configDN = new ConfigDN("${props.apiKey}");`,
        javascript: `let configDN = new ConfigDN("${props.apiKey}");`
    }


    return <div className="api-info">
        <h1 className="api-info-title">Accessing this config</h1>
        <div className="api-info-key">
            <p className="api-info-section-title">API Key ({props.config}, {props.environment} Environment)</p>
            <p className="api-info-box">{props.apiKey}</p>
        </div>

        <h2 className="api-info-section-title">Integrations</h2>
        <div className="language-buttons">
            <button className={`language-button ${language === "go" ? "selected" : ""}`}
                    onClick={() => setLanguage("go")}>Go
            </button>
            <button className={`language-button ${language === "javascript" ? "selected" : ""}`}
                    onClick={() => setLanguage("javascript")}>JavaScript
            </button>
        </div>

        <div className="api-info-box">
            {/* @ts-ignore */}
            <pre>{codeSnippets[language]}</pre>
        </div>
    </div>;
}