import URLS from "../../helpers/URLS";

export default function Footer() {
    const isConfigDN = typeof window !== 'undefined' && window.location.hostname === 'configdn.com';
    
    return (
        <footer className="mt-auto px-6 py-6 text-center text-xs text-muted">
            <div className="flex flex-wrap items-center justify-center gap-3">
                {isConfigDN && (
                    <div className="flex items-center gap-3">
                        <a href={URLS.PRIVACY_POLICY} className="hover:text-cyan">Privacy Policy</a>
                        <span className="text-line">•</span>
                        <a href={URLS.TERMS_OF_SERVICE} className="hover:text-cyan">Terms of Service</a>
                    </div>
                )}
                <div>
                    © 2025 dBuidl Limited. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
