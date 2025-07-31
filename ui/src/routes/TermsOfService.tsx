import Page from "../components/general/Page";
import Content from "../components/general/Content";
import NavBar from "../components/navbar/NavBar";
import logo from "../assets/images/raster/logo.png";
import NavBarLinksContainer from "../components/navbar/NavBarLinksContainer";
import NavAuthLinks from "../components/navbar/NavAuthLinks";
import { useEffect } from "preact/hooks";
import { useNavigate } from "react-router-dom";
import URLS from "../helpers/URLS";

export default function TermsOfService() {
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
                <div className="terms-of-service">
                    <h1>Terms of Service</h1>
                    <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
                    
                    <h2>1. Agreement to Terms</h2>
                    <p>
                        By accessing and using ConfigDN (the "Service"), you agree to be bound by these Terms of Service 
                        ("Terms"). If you do not agree to these Terms, you may not access or use the Service.
                    </p>
                    
                    <h2>2. Company Information</h2>
                    <p>
                        ConfigDN is provided by:<br/>
                        <strong>Company Name:</strong> dbuidl Limited<br/>
                        <strong>Company Number:</strong> SC730458<br/>
                        <strong>Registered Address:</strong> 272 Bath Street, Glasgow, Scotland, G2 4JR<br/>
                        <strong>Country:</strong> United Kingdom
                    </p>
                    
                    <h2>3. Description of Service</h2>
                    <p>
                        ConfigDN is a configuration management platform that allows users to manage application 
                        configurations across different environments and teams.
                    </p>
                    
                    <h2>4. User Accounts</h2>
                    <h3>4.1 Account Registration</h3>
                    <p>
                        To use certain features of the Service, you must create an account. You agree to provide accurate, 
                        current, and complete information during registration.
                    </p>
                    
                    <h3>4.2 Account Security</h3>
                    <p>
                        You are responsible for maintaining the confidentiality of your account credentials and for all 
                        activities that occur under your account.
                    </p>
                    
                    <h2>5. Acceptable Use</h2>
                    <p>You agree not to:</p>
                    <ul>
                        <li>Use the Service for any unlawful purpose or in violation of any applicable laws</li>
                        <li>Attempt to gain unauthorized access to the Service or its related systems</li>
                        <li>Interfere with or disrupt the Service or servers connected to the Service</li>
                        <li>Upload or transmit malicious code, viruses, or other harmful content</li>
                        <li>Violate the rights of others or engage in harassment or abuse</li>
                        <li>Use the Service to store or transmit illegal content</li>
                    </ul>
                    
                    <h2>6. Data and Privacy</h2>
                    <p>
                        Your use of the Service is also governed by our Privacy Policy. By using the Service, you consent 
                        to the collection and use of your information as outlined in our Privacy Policy.
                    </p>
                    
                    <h2>7. Intellectual Property</h2>
                    <h3>7.1 Our Rights</h3>
                    <p>
                        The Service and its original content, features, and functionality are owned by dbuidl Limited and 
                        are protected by international copyright, trademark, and other intellectual property laws.
                    </p>
                    
                    <h3>7.2 Your Content</h3>
                    <p>
                        You retain ownership of any content you submit to the Service. By submitting content, you grant us 
                        a license to use, modify, and display such content in connection with providing the Service.
                    </p>
                    
                    <h2>8. Service Availability</h2>
                    <p>
                        While we strive to provide reliable service, we do not guarantee that the Service will be available 
                        at all times or will be error-free. We reserve the right to modify, suspend, or discontinue the 
                        Service at any time.
                    </p>
                    
                    <h2>9. Limitation of Liability</h2>
                    <p>
                        To the maximum extent permitted by law, dbuidl Limited shall not be liable for any indirect, 
                        incidental, special, consequential, or punitive damages arising out of your use of the Service.
                    </p>
                    
                    <h2>10. Indemnification</h2>
                    <p>
                        You agree to indemnify and hold harmless dbuidl Limited from any claims, damages, or expenses 
                        arising from your use of the Service or violation of these Terms.
                    </p>
                    
                    <h2>11. Termination</h2>
                    <p>
                        We may terminate or suspend your account and access to the Service at our sole discretion, without 
                        prior notice, for conduct that we believe violates these Terms or is harmful to other users or us.
                    </p>
                    
                    <h2>12. Governing Law</h2>
                    <p>
                        These Terms shall be governed by and construed in accordance with the laws of Scotland, without 
                        regard to its conflict of law principles.
                    </p>
                    
                    <h2>13. Dispute Resolution</h2>
                    <p>
                        Any disputes arising out of or relating to these Terms or the Service shall be resolved through 
                        binding arbitration in accordance with the rules of the Scottish Arbitration Centre.
                    </p>
                    
                    <h2>14. Changes to Terms</h2>
                    <p>
                        We reserve the right to modify these Terms at any time. If we make material changes, we will notify 
                        you by email or through the Service. Your continued use of the Service after such notification 
                        constitutes acceptance of the new Terms.
                    </p>
                    
                    <h2>15. Severability</h2>
                    <p>
                        If any provision of these Terms is found to be unenforceable, the remaining provisions will remain 
                        in full force and effect.
                    </p>
                    
                    <h2>16. Contact Information</h2>
                    <p>
                        If you have any questions about these Terms, please contact us at:<br/>
                        <strong>Email:</strong> legal [at] dbuidl [dot] com<br/>
                        <strong>Address:</strong> dbuidl Limited, 272 Bath Street, Glasgow, Scotland, G2 4JR
                    </p>
                </div>
            </Content>
        </Page>
    );
}