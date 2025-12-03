import Link from "next/link";

export const metadata = {
    title: "Terms of Service | SmartPrints UK",
    description: "Terms of Service for SmartPrints UK - AI-powered educational activities for children.",
};

export default function TermsPage() {
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
                <h1 className="text-4xl font-bold mb-4 text-white">Terms of Service</h1>
                <p className="text-gray-400 mb-8">Last updated: December 2024</p>

                <div className="prose prose-invert max-w-none space-y-8">
                    
                    {/* Introduction */}
                    <section>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            Welcome to SmartPrints UK. These Terms of Service (&quot;Terms&quot;) govern your use of our website 
                            and services operated by SmartPrints UK (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By accessing or using 
                            our service, you agree to be bound by these Terms. If you disagree with any part of these 
                            terms, you may not access our service.
                        </p>
                    </section>

                    {/* Section 1 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Description of Service</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            SmartPrints UK provides an AI-powered platform that generates personalised educational 
                            activities for children, including colouring pages, drawing prompts, mazes, and connect-the-dots 
                            activities. Our service is designed to support parents and educators in creating engaging 
                            learning materials tailored to different age groups.
                        </p>
                        <p className="text-gray-300 leading-relaxed">
                            The service is provided on an &quot;as-is&quot; and &quot;as-available&quot; basis. We use artificial 
                            intelligence (Google Gemini) to generate content, and while we strive for high quality, 
                            we cannot guarantee that all generated content will be error-free or suitable for every purpose.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Account Registration</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            To access certain features of our service, you may be required to create an account. 
                            When you create an account, you agree to:
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li>Provide accurate, current, and complete information</li>
                            <li>Maintain and promptly update your account information</li>
                            <li>Maintain the security and confidentiality of your login credentials</li>
                            <li>Accept responsibility for all activities that occur under your account</li>
                            <li>Notify us immediately of any unauthorised use of your account</li>
                        </ul>
                        <p className="text-gray-300 leading-relaxed mt-4">
                            You must be at least 18 years old to create an account. The service is intended to be 
                            used by adults (parents, guardians, or educators) to create content for children.
                        </p>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Subscription Plans and Pricing</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            SmartPrints UK offers the following subscription tiers:
                        </p>
                        <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
                            <div>
                                <h3 className="text-white font-semibold">Free Tier</h3>
                                <p className="text-gray-400">3 activity generations total (lifetime limit)</p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Basic Plan - £4.99/month</h3>
                                <p className="text-gray-400">50 activity generations per month</p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Plus Plan - £9.99/month</h3>
                                <p className="text-gray-400">150 activity generations per month</p>
                            </div>
                        </div>
                        <p className="text-gray-300 leading-relaxed mt-4">
                            Prices are in British Pounds (GBP) and include VAT where applicable. We reserve the 
                            right to modify pricing with 30 days&apos; notice to existing subscribers.
                        </p>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Billing and Payments</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            Subscription fees are billed in advance on a monthly recurring basis. By subscribing 
                            to a paid plan, you authorise us to charge your payment method automatically each 
                            billing period until you cancel.
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li>All payments are processed securely through Stripe</li>
                            <li>Your subscription will automatically renew unless cancelled</li>
                            <li>You may cancel your subscription at any time through your account dashboard</li>
                            <li>Cancellation takes effect at the end of your current billing period</li>
                            <li>Unused generations do not roll over to the next billing period</li>
                        </ul>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Refund Policy</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            Due to the digital nature of our service (instant AI-generated content), refunds are 
                            generally not provided once content has been generated. However, we may offer refunds 
                            at our discretion in the following circumstances:
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li>Technical issues preventing you from using the service</li>
                            <li>Duplicate charges or billing errors</li>
                            <li>Service not performing as described</li>
                        </ul>
                        <p className="text-gray-300 leading-relaxed mt-4">
                            To request a refund, please contact us at{" "}
                            <a href="mailto:support@smartprintsuk.com" className="text-purple-400 hover:text-purple-300">
                                support@smartprintsuk.com
                            </a>{" "}
                            within 14 days of your purchase. Please see our{" "}
                            <Link href="/refund" className="text-purple-400 hover:text-purple-300">
                                Refund Policy
                            </Link>{" "}
                            for full details.
                        </p>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Intellectual Property Rights</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            <strong className="text-white">Our Content:</strong> The SmartPrints UK platform, including its 
                            design, logos, software, and original content, is owned by SmartPrints UK and protected 
                            by intellectual property laws.
                        </p>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            <strong className="text-white">Generated Content:</strong> Activities generated through our service 
                            are licensed to you for personal, non-commercial use. You may:
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li>Print and use generated activities with your children or students</li>
                            <li>Share printed activities within your household or classroom</li>
                            <li>Store digital copies for your personal use</li>
                        </ul>
                        <p className="text-gray-300 leading-relaxed mt-4">
                            <strong className="text-white">You may not:</strong>
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li>Resell, redistribute, or commercially exploit generated content</li>
                            <li>Claim ownership or authorship of generated content</li>
                            <li>Use generated content to create competing products or services</li>
                            <li>Remove any watermarks or attribution from generated content</li>
                        </ul>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Acceptable Use</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            You agree not to use our service to:
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li>Generate content that is illegal, harmful, or inappropriate for children</li>
                            <li>Attempt to bypass usage limits or abuse the service</li>
                            <li>Interfere with or disrupt the service or servers</li>
                            <li>Use automated systems to access the service without permission</li>
                            <li>Violate any applicable laws or regulations</li>
                            <li>Infringe on the rights of others</li>
                        </ul>
                        <p className="text-gray-300 leading-relaxed mt-4">
                            We reserve the right to suspend or terminate accounts that violate these terms without 
                            prior notice or refund.
                        </p>
                    </section>

                    {/* Section 8 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">8. Privacy and Data Protection</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Your privacy is important to us. Please review our{" "}
                            <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
                                Privacy Policy
                            </Link>{" "}
                            to understand how we collect, use, and protect your personal information. By using 
                            our service, you consent to the collection and use of information as described in 
                            our Privacy Policy.
                        </p>
                    </section>

                    {/* Section 9 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">9. Disclaimer of Warranties</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, 
                            EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li>Implied warranties of merchantability or fitness for a particular purpose</li>
                            <li>Warranties that the service will be uninterrupted, error-free, or secure</li>
                            <li>Warranties regarding the accuracy or reliability of AI-generated content</li>
                            <li>Warranties that the service will meet your specific requirements</li>
                        </ul>
                        <p className="text-gray-300 leading-relaxed mt-4">
                            We recommend reviewing all generated content before sharing with children to ensure 
                            it meets your standards and expectations.
                        </p>
                    </section>

                    {/* Section 10 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">10. Limitation of Liability</h2>
                        <p className="text-gray-300 leading-relaxed">
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, SMARTPRINTS UK AND ITS DIRECTORS, EMPLOYEES, 
                            PARTNERS, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
                            CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, 
                            DATA, USE, OR GOODWILL. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US 
                            IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
                        </p>
                    </section>

                    {/* Section 11 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">11. Changes to Terms</h2>
                        <p className="text-gray-300 leading-relaxed">
                            We reserve the right to modify these Terms at any time. We will notify users of 
                            material changes by posting the updated Terms on our website and updating the 
                            &quot;Last updated&quot; date. Your continued use of the service after changes become 
                            effective constitutes acceptance of the revised Terms.
                        </p>
                    </section>

                    {/* Section 12 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">12. Governing Law</h2>
                        <p className="text-gray-300 leading-relaxed">
                            These Terms shall be governed by and construed in accordance with the laws of 
                            England and Wales. Any disputes arising from these Terms or your use of the 
                            service shall be subject to the exclusive jurisdiction of the courts of England 
                            and Wales.
                        </p>
                    </section>

                    {/* Section 13 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">13. Contact Us</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            If you have any questions about these Terms, please contact us:
                        </p>
                        <div className="bg-gray-800/50 rounded-lg p-6">
                            <p className="text-gray-300">
                                <strong className="text-white">Email:</strong>{" "}
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
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
                        <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
                    </div>
                    <p>© {new Date().getFullYear()} SmartPrints UK. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}