import URLS from "../../helpers/URLS";

export default function Footer() {
    const isConfigDN = typeof window !== 'undefined' && window.location.hostname === 'configdn.com';
    
    return (
        <footer className="footer">
            <div className="footer-content">
                {isConfigDN && (
                    <div className="footer-links">
                        <a href={URLS.PRIVACY_POLICY} className="footer-link">Privacy Policy</a>
                        <span className="footer-separator">•</span>
                        <a href={URLS.TERMS_OF_SERVICE} className="footer-link">Terms of Service</a>
                    </div>
                )}
                <div className="footer-copyright">
                    © 2025 dBuidl Limited. All rights reserved.
                </div>
            </div>
        </footer>
    );
}