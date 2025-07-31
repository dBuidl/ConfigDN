import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons/faArrowRight";
import {useState} from "preact/hooks";

interface FeatureFlags {
    darkMode: boolean;
    newHeader: boolean;
    showPromoBanner: boolean;
    enableAnimations: boolean;
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
        enableAnimations: true,
        betaFeatures: false,
        buttonColor: '#0080aa',
        maxRetries: 3,
        apiEndpoint: 'https://api.configdn.com/v1'
    });

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

    return <div className="content-demo">
        <div className="content-demo-flags">
            <div className="demo-panel-header">
                <h3>Feature Flags</h3>
                <p>Toggle features to see live changes</p>
            </div>
            <div className="demo-flags-list">
                <div className="demo-flag-item">
                    <label className="demo-flag-label">
                        <input 
                            type="checkbox" 
                            checked={flags.darkMode}
                            onChange={() => toggleFlag('darkMode')}
                            className="demo-flag-checkbox"
                        />
                        <span className="demo-flag-slider"></span>
                        Dark Mode
                    </label>
                </div>
                <div className="demo-flag-item">
                    <label className="demo-flag-label">
                        <input 
                            type="checkbox" 
                            checked={flags.newHeader}
                            onChange={() => toggleFlag('newHeader')}
                            className="demo-flag-checkbox"
                        />
                        <span className="demo-flag-slider"></span>
                        New Header Design
                    </label>
                </div>
                <div className="demo-flag-item">
                    <label className="demo-flag-label">
                        <input 
                            type="checkbox" 
                            checked={flags.showPromoBanner}
                            onChange={() => toggleFlag('showPromoBanner')}
                            className="demo-flag-checkbox"
                        />
                        <span className="demo-flag-slider"></span>
                        Promo Banner
                    </label>
                </div>
                <div className="demo-flag-item">
                    <label className="demo-flag-label">
                        <input 
                            type="checkbox" 
                            checked={flags.enableAnimations}
                            onChange={() => toggleFlag('enableAnimations')}
                            className="demo-flag-checkbox"
                        />
                        <span className="demo-flag-slider"></span>
                        Animations
                    </label>
                </div>
                <div className="demo-flag-item">
                    <label className="demo-flag-label">
                        <input 
                            type="checkbox" 
                            checked={flags.betaFeatures}
                            onChange={() => toggleFlag('betaFeatures')}
                            className="demo-flag-checkbox"
                        />
                        <span className="demo-flag-slider"></span>
                        Beta Features
                    </label>
                </div>
                
                <div className="demo-flag-divider">
                    <span>Configuration Values</span>
                </div>
                
                <div className="demo-flag-item demo-flag-item--input">
                    <label className="demo-flag-input-label">Button Color</label>
                    <input 
                        type="color" 
                        value={flags.buttonColor}
                        onChange={(e) => updateFlag('buttonColor', (e.target as HTMLInputElement).value)}
                        className="demo-flag-color-input"
                    />
                </div>
                
                <div className="demo-flag-item demo-flag-item--input">
                    <label className="demo-flag-input-label">Max Retries</label>
                    <input 
                        type="number" 
                        value={flags.maxRetries}
                        onChange={(e) => updateFlag('maxRetries', parseInt((e.target as HTMLInputElement).value) || 0)}
                        className="demo-flag-number-input"
                        min="0"
                        max="10"
                    />
                </div>
                
                <div className="demo-flag-item demo-flag-item--input">
                    <label className="demo-flag-input-label">API Endpoint</label>
                    <select 
                        value={flags.apiEndpoint}
                        onChange={(e) => updateFlag('apiEndpoint', (e.target as HTMLSelectElement).value)}
                        className="demo-flag-select-input"
                    >
                        <option value="https://api.configdn.com/v1">Production API</option>
                        <option value="https://staging-api.configdn.com/v1">Staging API</option>
                        <option value="https://dev-api.configdn.com/v1">Development API</option>
                    </select>
                </div>
            </div>
        </div>
        <div className="content-demo-arrow">
            <FontAwesomeIcon icon={faArrowRight}/>
        </div>
        <div className="content-demo-site">
            <div className="demo-panel-header">
                <h3>Live Preview</h3>
                <p>See your changes instantly</p>
            </div>
            <div className={`demo-preview ${flags.darkMode ? 'dark-theme' : 'light-theme'}`}>
                <div className={`demo-preview-header ${flags.newHeader ? 'new-design' : 'old-design'} ${flags.enableAnimations ? 'animated' : ''}`}>
                    <div className="demo-preview-logo">ConfigDN</div>
                    <div className="demo-preview-nav">
                        <span>Home</span>
                        <span>Features</span>
                        {flags.betaFeatures && <span className="beta-nav">Beta</span>}
                    </div>
                </div>
                {flags.showPromoBanner && (
                    <div className={`demo-preview-banner ${flags.enableAnimations ? 'animated' : ''}`}>
                        🎉 New features available! Try them out now.
                    </div>
                )}
                <div className="demo-preview-content">
                    <h4>Welcome to ConfigDN</h4>
                    <p>Manage your application configuration with ease.</p>
                    {flags.betaFeatures && (
                        <div className="demo-preview-beta-section">
                            <h5>🚀 Beta Features</h5>
                            <p>Advanced analytics and real-time collaboration.</p>
                        </div>
                    )}
                    <div className={`demo-preview-card ${flags.enableAnimations ? 'animated' : ''}`}>
                        <h5>Configuration Dashboard</h5>
                        <div className="demo-preview-stats">
                            <div className="stat">
                                <span className="stat-number">12</span>
                                <span className="stat-label">Active Configs</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">3</span>
                                <span className="stat-label">Environments</span>
                            </div>
                        </div>
                        <div className="demo-preview-actions">
                            <button 
                                className="demo-action-button"
                                style={{ backgroundColor: flags.buttonColor }}
                            >
                                Deploy Changes
                            </button>
                        </div>
                    </div>
                    
                    <div className="demo-preview-config-display">
                        <h5>Live Configuration</h5>
                        <div className="config-item">
                            <span className="config-key">API_ENDPOINT:</span>
                            <span className="config-value">{flags.apiEndpoint}</span>
                        </div>
                        <div className="config-item">
                            <span className="config-key">MAX_RETRIES:</span>
                            <span className="config-value">{flags.maxRetries}</span>
                        </div>
                        <div className="config-item">
                            <span className="config-key">BUTTON_COLOR:</span>
                            <span className="config-value">{flags.buttonColor}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>;
}