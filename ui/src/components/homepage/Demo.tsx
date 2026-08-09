import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons/faArrowRight";
import {useState} from "preact/hooks";

interface FeatureFlags {
    darkMode: boolean;
    newHeader: boolean;
    showPromoBanner: boolean;
    betaFeatures: boolean;
    buttonColor: string;
    maxRetries: number;
    apiEndpoint: string;
}

export default function Demo() {
    const [flags, setFlags] = useState<FeatureFlags>({
        darkMode: false,
        newHeader: false,
        showPromoBanner: true,
        betaFeatures: false,
        buttonColor: '#0080aa',
        maxRetries: 3,
        apiEndpoint: 'https://api.configdn.com/v1'
    });
    const configValueClass = flags.darkMode ? "text-cyan" : "text-[#0f766e]";

    const toggleFlag = (key: keyof FeatureFlags) => {
        setFlags(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const updateFlag = (key: keyof FeatureFlags, value: any) => {
        setFlags(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return <div className="mt-14 grid items-center gap-6 lg:grid-cols-[minmax(0,0.78fr)_auto_minmax(0,1.22fr)]">
        <div className="overflow-hidden rounded-3xl border border-line bg-panel p-5 shadow-[0_24px_70px_rgba(0,0,0,0.2)]">
            <div className="border-b border-line/70 pb-4">
                <h3 className="text-lg font-semibold text-copy">Feature Flags</h3>
                <p className="mt-1 text-sm text-muted">Toggle features to see live changes</p>
            </div>
            <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-ink/50">
                    <label className="flex cursor-pointer items-center gap-3 text-sm text-copy">
                        <input 
                            type="checkbox" 
                            checked={flags.darkMode}
                            onChange={() => toggleFlag('darkMode')}
                            className="peer sr-only"
                        />
                        <span className="relative h-5 w-9 rounded-full bg-line after:absolute after:left-1 after:top-1 after:h-3 after:w-3 after:rounded-full after:bg-muted after:transition peer-checked:bg-lime peer-checked:after:translate-x-4 peer-checked:after:bg-ink"></span>
                        Dark Mode
                    </label>
                </div>
                <div className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-ink/50">
                    <label className="flex cursor-pointer items-center gap-3 text-sm text-copy">
                        <input 
                            type="checkbox" 
                            checked={flags.newHeader}
                            onChange={() => toggleFlag('newHeader')}
                            className="peer sr-only"
                        />
                        <span className="relative h-5 w-9 rounded-full bg-line after:absolute after:left-1 after:top-1 after:h-3 after:w-3 after:rounded-full after:bg-muted after:transition peer-checked:bg-lime peer-checked:after:translate-x-4 peer-checked:after:bg-ink"></span>
                        New Header Design
                    </label>
                </div>
                <div className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-ink/50">
                    <label className="flex cursor-pointer items-center gap-3 text-sm text-copy">
                        <input 
                            type="checkbox" 
                            checked={flags.showPromoBanner}
                            onChange={() => toggleFlag('showPromoBanner')}
                            className="peer sr-only"
                        />
                        <span className="relative h-5 w-9 rounded-full bg-line after:absolute after:left-1 after:top-1 after:h-3 after:w-3 after:rounded-full after:bg-muted after:transition peer-checked:bg-lime peer-checked:after:translate-x-4 peer-checked:after:bg-ink"></span>
                        Promo Banner
                    </label>
                </div>
                <div className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-ink/50">
                    <label className="flex cursor-pointer items-center gap-3 text-sm text-copy">
                        <input 
                            type="checkbox" 
                            checked={flags.betaFeatures}
                            onChange={() => toggleFlag('betaFeatures')}
                            className="peer sr-only"
                        />
                        <span className="relative h-5 w-9 rounded-full bg-line after:absolute after:left-1 after:top-1 after:h-3 after:w-3 after:rounded-full after:bg-muted after:transition peer-checked:bg-lime peer-checked:after:translate-x-4 peer-checked:after:bg-ink"></span>
                        Beta Features
                    </label>
                </div>
                
                <div className="my-3 border-t border-line/70 pt-3 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-cyan">
                    <span>Configuration Values</span>
                </div>
                
                <div className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-ink/50">
                    <label className="text-sm text-muted">Button Color</label>
                    <input 
                        type="color" 
                        value={flags.buttonColor}
                        onChange={(e) => updateFlag('buttonColor', (e.target as HTMLInputElement).value)}
                        className="h-8 w-12 cursor-pointer rounded-lg border border-line bg-ink p-0.5"
                    />
                </div>
                
                <div className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-ink/50">
                    <label className="text-sm text-muted">Max Retries</label>
                    <input 
                        type="number" 
                        value={flags.maxRetries}
                        onChange={(e) => updateFlag('maxRetries', parseInt((e.target as HTMLInputElement).value) || 0)}
                        className="w-20 rounded-lg border border-line bg-ink px-2 py-1.5 text-sm text-copy outline-none focus:border-cyan"
                        min="0"
                        max="10"
                    />
                </div>
                
                <div className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 hover:bg-ink/50">
                    <label className="text-sm text-muted">API Endpoint</label>
                    <select 
                        value={flags.apiEndpoint}
                        onChange={(e) => updateFlag('apiEndpoint', (e.target as HTMLSelectElement).value)}
                        className="min-w-0 rounded-lg border border-line bg-ink px-2 py-1.5 text-sm text-copy outline-none focus:border-cyan"
                    >
                        <option value="https://api.configdn.com/v1">Production API</option>
                        <option value="https://staging-api.configdn.com/v1">Staging API</option>
                        <option value="https://dev-api.configdn.com/v1">Development API</option>
                    </select>
                </div>
            </div>
        </div>
        <div className="hidden h-12 w-12 items-center justify-center rounded-full border border-line bg-panel text-lime lg:flex">
            <FontAwesomeIcon icon={faArrowRight}/>
        </div>
        <div className="overflow-hidden rounded-3xl border border-line bg-panel shadow-[0_24px_70px_rgba(0,0,0,0.2)]">
            <div className="border-b border-line/70 p-5 pb-4">
                <h3 className="text-lg font-semibold text-copy">Live Preview</h3>
                <p className="mt-1 text-sm text-muted">See your changes instantly</p>
            </div>
            <div className={`min-h-[29rem] p-4 transition ${flags.darkMode ? 'bg-[#0a1521] text-copy' : 'bg-[#e9f0ec] text-[#13251f]'}`}>
                <div className={`flex items-center justify-between px-4 py-3 text-sm font-bold ${flags.newHeader ? 'rounded-2xl bg-[#b9f36b] text-[#102018]' : 'rounded-xl bg-[#17372f] text-copy'}`}>
                    <div className="font-mono text-xs tracking-[0.12em]">ConfigDN</div>
                    <div className="flex gap-3 text-xs opacity-80">
                        <span>Home</span>
                        <span>Features</span>
                        {flags.betaFeatures && <span className="rounded-full bg-amber px-2 py-0.5 text-ink">Beta</span>}
                    </div>
                </div>
                {flags.showPromoBanner && (
                    <div className="mt-3 rounded-xl bg-amber px-3 py-2 text-xs font-semibold text-ink">
                        🎉 New features available! Try them out now.
                    </div>
                )}
                <div className="p-4">
                    <h4 className="text-2xl font-semibold tracking-tight">Welcome to ConfigDN</h4>
                    <p className="mt-1 text-sm opacity-65">Manage your application configuration with ease.</p>
                    {flags.betaFeatures && (
                        <div className="mt-4 rounded-xl border border-cyan/30 bg-cyan/10 p-3 text-sm">
                            <h5 className="font-semibold">Beta Features</h5>
                            <p className="mt-1 opacity-75">Advanced analytics and real-time collaboration.</p>
                        </div>
                    )}
                    <div className={`mt-4 rounded-2xl border border-current/10 p-4 ${flags.darkMode ? 'bg-white/5' : 'bg-black/5'}`}>
                        <h5 className="text-sm font-bold">Configuration Dashboard</h5>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                            <div className={`rounded-xl p-3 ${flags.darkMode ? 'bg-white/5' : 'bg-black/5'}`}>
                                <span className="block text-2xl font-bold">12</span>
                                <span className="block text-[0.65rem] uppercase tracking-[0.1em] opacity-60">Active Configs</span>
                            </div>
                            <div className={`rounded-xl p-3 ${flags.darkMode ? 'bg-white/5' : 'bg-black/5'}`}>
                                <span className="block text-2xl font-bold">3</span>
                                <span className="block text-[0.65rem] uppercase tracking-[0.1em] opacity-60">Environments</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <button 
                                className="rounded-lg px-3 py-2 text-xs font-bold text-white shadow-lg"
                                style={{ backgroundColor: flags.buttonColor }}
                            >
                                Deploy Changes
                            </button>
                        </div>
                    </div>
                    
                    <div className={`mt-4 rounded-2xl border border-current/10 p-4 ${flags.darkMode ? 'bg-white/5' : 'bg-black/5'}`}>
                        <h5 className="text-sm font-bold">Live Configuration</h5>
                        <div className="mt-2 flex flex-wrap justify-between gap-2 border-b border-current/10 py-1.5 font-mono text-[0.65rem]">
                            <span className="opacity-60">API_ENDPOINT:</span>
                            <span className={configValueClass}>{flags.apiEndpoint}</span>
                        </div>
                        <div className="mt-2 flex flex-wrap justify-between gap-2 border-b border-current/10 py-1.5 font-mono text-[0.65rem]">
                            <span className="opacity-60">MAX_RETRIES:</span>
                            <span className={configValueClass}>{flags.maxRetries}</span>
                        </div>
                        <div className="mt-2 flex flex-wrap justify-between gap-2 border-b border-current/10 py-1.5 font-mono text-[0.65rem]">
                            <span className="opacity-60">BUTTON_COLOR:</span>
                            <span className={configValueClass}>{flags.buttonColor}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>;
}
