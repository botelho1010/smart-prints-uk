import Link from "next/link";

export const metadata = {
    title: "Privacy Policy | SmartPrints UK",
    description: "Privacy Policy for SmartPrints UK - How we collect, use, and protect your personal data.",
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#0f1117] text-white">
            {/* Header */}
            <header className="border-b border-gray-800">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/" className="text-xl font-bold text-white hover:text-purple-400 transition-colors">
                        ← SmartPrints UK
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="text-4xl font-bold mb-4 text-white">Privacy Policy</h1>
                <p className="text-gray-400 mb-8">Last updated: December 2024</p>

                <div className="prose prose-invert max-w-none space-y-8">
                    
                    {/* Introduction */}
                    <section>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            At SmartPrints UK, we take your privacy seriously. This Privacy Policy explains how we 
                            collect, use, disclose, and safeguard your information when you use our website and services. 
                            We are committed to protecting your personal data in accordance with the UK General Data 
                            Protection Regulation (UK GDPR) and the Data Protection Act 2018.
                        </p>
                    </section>

                    {/* Section 1 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Data Controller</h2>
                        <p className="text-gray-300 leading-relaxed">
                            SmartPrints UK is the data controller responsible for your personal data. If you have 
                            any questions about this Privacy Policy or our data practices, please contact us at{" "}
                            <a href="mailto:privacy@smartprintsuk.com" className="text-purple-400 hover:text-purple-300">
                                privacy@smartprintsuk.com
                            </a>.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            We collect different types of information depending on how you interact with our service:
                        </p>
                        
                        <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.1 Information You Provide</h3>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li><strong className="text-white">Account Information:</strong> Email address, name, and authentication 
                                details when you create an account via Clerk</li>
                            <li><strong className="text-white">Activity Data:</strong> Child&apos;s first name, age group, and topic 
                                preferences you enter to generate activities</li>
                            <li><strong className="text-white">Payment Information:</strong> Billing details processed securely through 
                                Stripe (we do not store full card numbers)</li>
                            <li><strong className="text-white">Communications:</strong> Information you provide when contacting our support team</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.2 Information Collected Automatically</h3>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li><strong className="text-white">Usage Data:</strong> Pages visited, features used, time spent on service</li>
                            <li><strong className="text-white">Device Information:</strong> Browser type, operating system, device identifiers</li>
                            <li><strong className="text-white">Log Data:</strong> IP address, access times, referring URLs</li>
                            <li><strong className="text-white">Cookies:</strong> See our <Link href="/cookies" className="text-purple-400 hover:text-purple-300">Cookie Policy</Link> for details</li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            We use your personal data for the following purposes:
                        </p>
                        <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
                            <div className="flex gap-4">
                                <span className="text-purple-400 font-bold">✓</span>
                                <div>
                                    <p className="text-white font-semibold">Service Delivery</p>
                                    <p className="text-gray-400 text-sm">To generate personalised educational activities and provide our core service</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-purple-400 font-bold">✓</span>
                                <div>
                                    <p className="text-white font-semibold">Account Management</p>
                                    <p className="text-gray-400 text-sm">To create and manage your account, authenticate your identity</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-purple-400 font-bold">✓</span>
                                <div>
                                    <p className="text-white font-semibold">Payment Processing</p>
                                    <p className="text-gray-400 text-sm">To process subscription payments and manage billing</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-purple-400 font-bold">✓</span>
                                <div>
                                    <p className="text-white font-semibold">Communication</p>
                                    <p className="text-gray-400 text-sm">To send service updates, respond to inquiries, and provide support</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-purple-400 font-bold">✓</span>
                                <div>
                                    <p className="text-white font-semibold">Service Improvement</p>
                                    <p className="text-gray-400 text-sm">To analyse usage patterns and improve our service</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-purple-400 font-bold">✓</span>
                                <div>
                                    <p className="text-white font-semibold">Legal Compliance</p>
                                    <p className="text-gray-400 text-sm">To comply with legal obligations and protect our rights</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Legal Basis for Processing (UK GDPR)</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            We process your personal data under the following legal bases:
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 space-y-3">
                            <li>
                                <strong className="text-white">Contract Performance:</strong> Processing necessary to provide our 
                                service and fulfil our contractual obligations to you
                            </li>
                            <li>
                                <strong className="text-white">Legitimate Interests:</strong> Processing for our legitimate business 
                                interests, such as improving our service and preventing fraud, where these interests are not 
                                overridden by your rights
                            </li>
                            <li>
                                <strong className="text-white">Consent:</strong> Where you have given explicit consent for specific 
                                processing activities, such as marketing communications
                            </li>
                            <li>
                                <strong className="text-white">Legal Obligation:</strong> Processing necessary to comply with our 
                                legal obligations
                            </li>
                        </ul>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Data Sharing and Third Parties</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            We share your data with trusted third-party service providers who assist us in operating 
                            our service. These providers are contractually obligated to protect your data:
                        </p>
                        <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
                            <div>
                                <h3 className="text-white font-semibold">Clerk (Authentication)</h3>
                                <p className="text-gray-400 text-sm">Handles user authentication and account management</p>
                                <a href="https://clerk.com/privacy" className="text-purple-400 text-sm hover:text-purple-300" target="_blank" rel="noopener noreferrer">
                                    View Clerk Privacy Policy →
                                </a>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Stripe (Payments)</h3>
                                <p className="text-gray-400 text-sm">Processes payment transactions securely</p>
                                <a href="https://stripe.com/privacy" className="text-purple-400 text-sm hover:text-purple-300" target="_blank" rel="noopener noreferrer">
                                    View Stripe Privacy Policy →
                                </a>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Google (AI Generation)</h3>
                                <p className="text-gray-400 text-sm">Powers our AI content generation via Gemini API</p>
                                <a href="https://policies.google.com/privacy" className="text-purple-400 text-sm hover:text-purple-300" target="_blank" rel="noopener noreferrer">
                                    View Google Privacy Policy →
                                </a>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Vercel (Hosting)</h3>
                                <p className="text-gray-400 text-sm">Hosts our website and application</p>
                                <a href="https://vercel.com/legal/privacy-policy" className="text-purple-400 text-sm hover:text-purple-300" target="_blank" rel="noopener noreferrer">
                                    View Vercel Privacy Policy →
                                </a>
                            </div>
                        </div>
                        <p className="text-gray-300 leading-relaxed mt-4">
                            We do not sell your personal data to third parties. We may disclose your information 
                            if required by law or to protect our rights and safety.
                        </p>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. International Data Transfers</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Some of our third-party service providers are located outside the UK. When we transfer 
                            your data internationally, we ensure appropriate safeguards are in place, such as 
                            Standard Contractual Clauses approved by the UK Information Commissioner&apos;s Office (ICO), 
                            or transfers to countries with adequate data protection laws.
                        </p>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Data Retention</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            We retain your personal data only for as long as necessary to fulfil the purposes 
                            for which it was collected:
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li><strong className="text-white">Account Data:</strong> Retained while your account is active, plus 
                                30 days after deletion request</li>
                            <li><strong className="text-white">Activity History:</strong> Retained for 12 months for your convenience, 
                                then automatically deleted</li>
                            <li><strong className="text-white">Payment Records:</strong> Retained for 7 years as required by UK tax law</li>
                            <li><strong className="text-white">Usage Analytics:</strong> Retained in anonymised form indefinitely</li>
                        </ul>
                    </section>

                    {/* Section 8 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">8. Your Rights (UK GDPR)</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            Under UK data protection law, you have the following rights:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-gray-800/50 rounded-lg p-4">
                                <h3 className="text-white font-semibold mb-2">Right of Access</h3>
                                <p className="text-gray-400 text-sm">Request a copy of your personal data</p>
                            </div>
                            <div className="bg-gray-800/50 rounded-lg p-4">
                                <h3 className="text-white font-semibold mb-2">Right to Rectification</h3>
                                <p className="text-gray-400 text-sm">Request correction of inaccurate data</p>
                            </div>
                            <div className="bg-gray-800/50 rounded-lg p-4">
                                <h3 className="text-white font-semibold mb-2">Right to Erasure</h3>
                                <p className="text-gray-400 text-sm">Request deletion of your data (&quot;right to be forgotten&quot;)</p>
                            </div>
                            <div className="bg-gray-800/50 rounded-lg p-4">
                                <h3 className="text-white font-semibold mb-2">Right to Restrict Processing</h3>
                                <p className="text-gray-400 text-sm">Request limitation of data processing</p>
                            </div>
                            <div className="bg-gray-800/50 rounded-lg p-4">
                                <h3 className="text-white font-semibold mb-2">Right to Data Portability</h3>
                                <p className="text-gray-400 text-sm">Receive your data in a portable format</p>
                            </div>
                            <div className="bg-gray-800/50 rounded-lg p-4">
                                <h3 className="text-white font-semibold mb-2">Right to Object</h3>
                                <p className="text-gray-400 text-sm">Object to processing based on legitimate interests</p>
                            </div>
                        </div>
                        <p className="text-gray-300 leading-relaxed mt-4">
                            To exercise any of these rights, please contact us at{" "}
                            <a href="mailto:privacy@smartprintsuk.com" className="text-purple-400 hover:text-purple-300">
                                privacy@smartprintsuk.com
                            </a>. We will respond within 30 days.
                        </p>
                    </section>

                    {/* Section 9 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">9. Children&apos;s Privacy</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Our service is designed for use by adults (parents, guardians, educators) on behalf of 
                            children. We do not knowingly collect personal information directly from children under 13. 
                            The child&apos;s first name entered for activity personalisation is stored temporarily and 
                            used solely for generating the requested educational content. If you believe we have 
                            inadvertently collected information from a child, please contact us immediately.
                        </p>
                    </section>

                    {/* Section 10 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">10. Data Security</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            We implement appropriate technical and organisational measures to protect your personal 
                            data, including:
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li>SSL/TLS encryption for all data transmission</li>
                            <li>Secure authentication through Clerk</li>
                            <li>PCI-DSS compliant payment processing through Stripe</li>
                            <li>Regular security assessments and updates</li>
                            <li>Access controls limiting employee access to personal data</li>
                        </ul>
                        <p className="text-gray-300 leading-relaxed mt-4">
                            While we strive to protect your data, no method of transmission over the Internet is 
                            100% secure. We cannot guarantee absolute security.
                        </p>
                    </section>

                    {/* Section 11 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">11. Changes to This Policy</h2>
                        <p className="text-gray-300 leading-relaxed">
                            We may update this Privacy Policy from time to time. We will notify you of any material 
                            changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; 
                            date. We encourage you to review this Privacy Policy periodically.
                        </p>
                    </section>

                    {/* Section 12 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">12. Complaints</h2>
                        <p className="text-gray-300 leading-relaxed">
                            If you have concerns about how we handle your personal data, please contact us first 
                            so we can try to resolve the issue. You also have the right to lodge a complaint with 
                            the UK Information Commissioner&apos;s Office (ICO) at{" "}
                            <a href="https://ico.org.uk" className="text-purple-400 hover:text-purple-300" target="_blank" rel="noopener noreferrer">
                                ico.org.uk
                            </a>.
                        </p>
                    </section>

                    {/* Section 13 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">13. Contact Us</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            For any privacy-related questions or requests:
                        </p>
                        <div className="bg-gray-800/50 rounded-lg p-6">
                            <p className="text-gray-300">
                                <strong className="text-white">Privacy Email:</strong>{" "}
                                <a href="mailto:privacy@smartprintsuk.com" className="text-purple-400 hover:text-purple-300">
                                    privacy@smartprintsuk.com
                                </a>
                            </p>
                            <p className="text-gray-300 mt-2">
                                <strong className="text-white">General Support:</strong>{" "}
                                <a href="mailto:support@smartprintsuk.com" className="text-purple-400 hover:text-purple-300">
                                    support@smartprintsuk.com
                                </a>
                            </p>
                            <p className="text-gray-300 mt-2">
                                <strong className="text-white">Website:</strong>{" "}
                                <a href="https://smartprintsuk.com" className="text-purple-400 hover:text-purple-300">
                                    smartprintsuk.com
                                </a>
                            </p>
                        </div>
                    </section>

                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-800 py-8 mt-12">
                <div className="container mx-auto px-4 text-center text-gray-400">
                    <div className="flex justify-center gap-6 mb-4">
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
                        <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
                    </div>
                    <p>© {new Date().getFullYear()} SmartPrints UK. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}