import Link from "next/link";

export const metadata = {
    title: "Refund Policy | SmartPrints UK",
    description: "Refund Policy for SmartPrints UK - Our commitment to customer satisfaction.",
};

export default function RefundPage() {
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
                <h1 className="text-4xl font-bold mb-4 text-white">Refund Policy</h1>
                <p className="text-gray-400 mb-8">Last updated: December 2024</p>

                <div className="prose prose-invert max-w-none space-y-8">
                    
                    {/* Introduction */}
                    <section>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            At SmartPrints UK, we want you to be completely satisfied with our service. This Refund 
                            Policy explains when and how you can request a refund for your subscription.
                        </p>
                    </section>

                    {/* Section 1 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Digital Product Nature</h2>
                        <p className="text-gray-300 leading-relaxed">
                            SmartPrints UK provides instant access to AI-generated educational content. Due to the 
                            digital nature of our service, where content is generated immediately upon request, 
                            standard refund policies for physical goods do not apply. Once you generate an activity, 
                            that content has been delivered to you.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. When We Offer Refunds</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            We will consider refund requests in the following circumstances:
                        </p>
                        <div className="space-y-4">
                            <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
                                <h3 className="text-green-400 font-semibold mb-2">✓ Technical Issues</h3>
                                <p className="text-gray-300 text-sm">
                                    If you experience persistent technical problems that prevent you from using the 
                                    service, and our support team is unable to resolve them within a reasonable timeframe.
                                </p>
                            </div>
                            <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
                                <h3 className="text-green-400 font-semibold mb-2">✓ Billing Errors</h3>
                                <p className="text-gray-300 text-sm">
                                    If you were charged incorrectly, charged multiple times, or charged after 
                                    cancelling your subscription before the renewal date.
                                </p>
                            </div>
                            <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
                                <h3 className="text-green-400 font-semibold mb-2">✓ Service Not as Described</h3>
                                <p className="text-gray-300 text-sm">
                                    If the service fundamentally fails to perform as described on our website, 
                                    and we cannot remedy the situation.
                                </p>
                            </div>
                            <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
                                <h3 className="text-green-400 font-semibold mb-2">✓ First-Time Subscribers (14-Day Guarantee)</h3>
                                <p className="text-gray-300 text-sm">
                                    If you&apos;re a first-time subscriber and request a refund within 14 days of your 
                                    initial purchase, we will provide a full refund, no questions asked.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. When Refunds Are Not Available</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            Refunds are generally not available in these situations:
                        </p>
                        <div className="space-y-4">
                            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                                <h3 className="text-red-400 font-semibold mb-2">✗ Change of Mind</h3>
                                <p className="text-gray-300 text-sm">
                                    After content has been generated, refunds for simply changing your mind about 
                                    the subscription are not available.
                                </p>
                            </div>
                            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                                <h3 className="text-red-400 font-semibold mb-2">✗ Unused Generations</h3>
                                <p className="text-gray-300 text-sm">
                                    If you don&apos;t use all your monthly generations, they do not roll over and 
                                    are not refundable.
                                </p>
                            </div>
                            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                                <h3 className="text-red-400 font-semibold mb-2">✗ Partial Month Usage</h3>
                                <p className="text-gray-300 text-sm">
                                    If you cancel mid-month, your subscription remains active until the end of the 
                                    billing period. Partial refunds for unused days are not provided.
                                </p>
                            </div>
                            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                                <h3 className="text-red-400 font-semibold mb-2">✗ Violation of Terms</h3>
                                <p className="text-gray-300 text-sm">
                                    If your account was suspended or terminated due to violation of our Terms of 
                                    Service, no refund will be provided.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. How to Request a Refund</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            To request a refund, please follow these steps:
                        </p>
                        <ol className="list-decimal pl-6 text-gray-300 space-y-3">
                            <li>
                                <strong className="text-white">Contact Us:</strong> Email{" "}
                                <a href="mailto:support@smartprintsuk.com" className="text-purple-400 hover:text-purple-300">
                                    support@smartprintsuk.com
                                </a>{" "}
                                with the subject line &quot;Refund Request&quot;
                            </li>
                            <li>
                                <strong className="text-white">Provide Details:</strong> Include your account email, 
                                the date of purchase, and the reason for your refund request
                            </li>
                            <li>
                                <strong className="text-white">Wait for Response:</strong> We will review your request 
                                and respond within 3 business days
                            </li>
                            <li>
                                <strong className="text-white">Refund Processing:</strong> If approved, refunds are 
                                processed within 5-10 business days to your original payment method
                            </li>
                        </ol>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Refund Timeframe</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            Refund requests must be submitted within the following timeframes:
                        </p>
                        <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
                            <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                                <span className="text-white">First-time subscriber guarantee</span>
                                <span className="text-purple-400 font-semibold">14 days</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                                <span className="text-white">Technical issues</span>
                                <span className="text-purple-400 font-semibold">30 days</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                                <span className="text-white">Billing errors</span>
                                <span className="text-purple-400 font-semibold">60 days</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white">Service not as described</span>
                                <span className="text-purple-400 font-semibold">30 days</span>
                            </div>
                        </div>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Cancellation vs. Refund</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            It&apos;s important to understand the difference:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-gray-800/50 rounded-lg p-6">
                                <h3 className="text-white font-semibold mb-3">Cancellation</h3>
                                <ul className="text-gray-400 text-sm space-y-2">
                                    <li>• Stops future charges</li>
                                    <li>• Access continues until period ends</li>
                                    <li>• Can be done anytime in dashboard</li>
                                    <li>• No refund for current period</li>
                                </ul>
                            </div>
                            <div className="bg-gray-800/50 rounded-lg p-6">
                                <h3 className="text-white font-semibold mb-3">Refund</h3>
                                <ul className="text-gray-400 text-sm space-y-2">
                                    <li>• Money returned to you</li>
                                    <li>• Access may be revoked</li>
                                    <li>• Must contact support</li>
                                    <li>• Subject to this policy</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. UK Consumer Rights</h2>
                        <p className="text-gray-300 leading-relaxed">
                            This policy does not affect your statutory rights under UK consumer protection laws. 
                            Under the Consumer Rights Act 2015 and Consumer Contracts Regulations 2013, you may 
                            have additional rights. If you believe you have statutory rights that are not addressed 
                            in this policy, please contact us and we will work with you to find a resolution.
                        </p>
                    </section>

                    {/* Section 8 */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">8. Contact Us</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            Have questions about our refund policy? We&apos;re here to help:
                        </p>
                        <div className="bg-gray-800/50 rounded-lg p-6">
                            <p className="text-gray-300">
                                <strong className="text-white">Email:</strong>{" "}
                                <a href="mailto:support@smartprintsuk.com" className="text-purple-400 hover:text-purple-300">
                                    support@smartprintsuk.com
                                </a>
                            </p>
                            <p className="text-gray-300 mt-2">
                                <strong className="text-white">Response Time:</strong> Within 24-48 hours on business days
                            </p>
                        </div>
                    </section>

                    {/* Highlight Box */}
                    <section className="bg-purple-900/20 border border-purple-800 rounded-lg p-6">
                        <h3 className="text-purple-400 font-semibold text-lg mb-2">💡 Our Promise</h3>
                        <p className="text-gray-300">
                            We believe in our product and want you to love it. If you&apos;re not satisfied, 
                            reach out to us. We&apos;ll do our best to make it right, whether that&apos;s through 
                            technical support, account credits, or a refund when appropriate.
                        </p>
                    </section>

                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-800 py-8 mt-12">
                <div className="container mx-auto px-4 text-center text-gray-400">
                    <div className="flex justify-center gap-6 mb-4">
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
                    </div>
                    <p>© {new Date().getFullYear()} SmartPrints UK. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}