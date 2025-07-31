import Page from "../components/general/Page";
import Content from "../components/general/Content";
import NavBar from "../components/navbar/NavBar";
import logo from "../assets/images/raster/logo.png";
import NavBarLinksContainer from "../components/navbar/NavBarLinksContainer";
import NavAuthLinks from "../components/navbar/NavAuthLinks";
import { useEffect } from "preact/hooks";
import { useNavigate } from "react-router-dom";
import URLS from "../helpers/URLS";

export default function PrivacyPolicy() {
    const navigate = useNavigate();
    const isConfigDN = typeof window !== 'undefined' && window.location.hostname === 'configdn.com';
    
    useEffect(() => {
        if (!isConfigDN) {
            navigate(URLS.HOME);
        }
    }, [isConfigDN, navigate]);
    
    if (!isConfigDN) {
        return null;
    }
    
    return (
        <Page>
            <NavBar logo={logo}>
                <NavBarLinksContainer>
                    <NavAuthLinks/>
                </NavBarLinksContainer>
            </NavBar>
            <Content>
                <div className="privacy-policy">
                    <h1>Privacy Policy</h1>
                    <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
                    
                    <h2>1. Introduction</h2>
                    <p>
                        dbuidl Limited ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy 
                        explains how we collect, use, and safeguard your information when you use our ConfigDN service.
                    </p>
                    
                    <h2>2. Company Information</h2>
                    <p>
                        <strong>Company Name:</strong> dbuidl Limited<br/>
                        <strong>Company Number:</strong> SC730458<br/>
                        <strong>Registered Address:</strong> 272 Bath Street, Glasgow, Scotland, G2 4JR<br/>
                        <strong>Country:</strong> United Kingdom
                    </p>
                    
                    <h2>3. Information We Collect</h2>
                    <h3>3.1 Personal Information</h3>
                    <p>We may collect the following personal information:</p>
                    <ul>
                        <li>Name and email address</li>
                        <li>Account credentials</li>
                        <li>Usage data and analytics</li>
                        <li>Communication preferences</li>
                    </ul>
                    
                    <h3>3.2 Technical Information</h3>
                    <p>We automatically collect certain technical information, including:</p>
                    <ul>
                        <li>IP address and browser information</li>
                        <li>Device and operating system details</li>
                        <li>Usage patterns and performance data</li>
                        <li>Cookies and similar tracking technologies</li>
                    </ul>
                    
                    <h2>4. How We Use Your Information</h2>
                    <p>We use your information to:</p>
                    <ul>
                        <li>Provide and maintain our service</li>
                        <li>Process your requests and transactions</li>
                        <li>Communicate with you about our service</li>
                        <li>Improve our service and user experience</li>
                        <li>Comply with legal obligations</li>
                    </ul>
                    
                    <h2>5. Information Sharing</h2>
                    <p>
                        We do not sell, trade, or rent your personal information to third parties. We may share your 
                        information only in the following circumstances:
                    </p>
                    <ul>
                        <li>With your explicit consent</li>
                        <li>To comply with legal obligations</li>
                        <li>To protect our rights and safety</li>
                        <li>With trusted service providers who assist in our operations</li>
                    </ul>
                    
                    <h2>6. Data Security</h2>
                    <p>
                        We implement appropriate technical and organizational measures to protect your personal information 
                        against unauthorized access, alteration, disclosure, or destruction.
                    </p>
                    
                    <h2>7. Your Rights</h2>
                    <p>Under applicable data protection laws, you have the right to:</p>
                    <ul>
                        <li>Access your personal data</li>
                        <li>Correct inaccurate data</li>
                        <li>Request deletion of your data</li>
                        <li>Object to processing</li>
                        <li>Data portability</li>
                        <li>Withdraw consent</li>
                    </ul>
                    
                    <h2>8. Cookies</h2>
                    <p>
                        We use cookies and similar technologies to enhance your experience, analyze usage, and provide 
                        personalized content. You can control cookie settings through your browser.
                    </p>
                    
                    <h2>9. Data Retention</h2>
                    <p>
                        We retain your personal information only for as long as necessary to fulfill the purposes outlined 
                        in this Privacy Policy, unless a longer retention period is required by law.
                    </p>
                    
                    <h2>10. International Transfers</h2>
                    <p>
                        Your information may be transferred to and processed in countries other than your own. We ensure 
                        appropriate safeguards are in place for such transfers.
                    </p>
                    
                    <h2>11. Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. We will notify you of any material changes 
                        by posting the new Privacy Policy on this page with an updated "Last updated" date.
                    </p>
                    
                    <h2>12. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at:<br/>
                        <strong>Email:</strong> privacy [at] dbuidl [dot] com<br/>
                        <strong>Address:</strong> dbuidl Limited, 272 Bath Street, Glasgow, Scotland, G2 4JR
                    </p>
                </div>
            </Content>
        </Page>
    );
}