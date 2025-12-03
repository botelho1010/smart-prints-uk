import Link from "next/link";

export const metadata = {
    title: "Cookie Policy | SmartPrints UK",
    description: "Cookie Policy for SmartPrints UK - How we use cookies and similar technologies.",
};

export default function CookiesPage() {
    return (
        <div className="min-h-screen bg-[#0f1117] text-white">
            <header className="border-b border-gray-800">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/" className="text-xl font-bold text-white hover:text-purple-400 transition-colors">
                        ← SmartPrints UK
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="text-4xl font-bold mb-4 text-white">Cookie Policy</h1>
                <p className="text-gray-400 mb-8">Last updated: December 2024</p>

                <div className="prose prose-invert max-w-none space-y-8">
                    
                    <section>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            This Cookie Policy explains how SmartPrints UK uses cookies and similar technologies 
                            when you visit our website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. What Are Cookies?</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Cookies are small text files stored on your device when you visit a website. They help 
                            websites remember your preferences and improve your experience.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Cookies We Use</h2>
                        
                        <div className="space-y-6">
                            <div className="bg-gray-800/50 rounded-lg p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">ESSENTIAL</span>
                                    <h3 className="text-white font-semibold">Strictly Necessary Cookies</h3>
                                </div>
                                <p className="text-gray-400 text-sm mb-4">
                                    Required for the website to function. Cannot be disabled.
                                </p>
                                <ul className="text-gray-300 text-sm space-y-2">
                                    <li><code className="bg-gray-700 px-1 rounded">__clerk_*</code> - Authentication</li>
                                    <li><code className="bg-gray-700 px-1 rounded">sp_anon_usage</code> - Free usage tracking</li>
                                    <li><code className="bg-gray-700 px-1 rounded">__stripe_*</code> - Payment security</li>
                                </ul>
                            </div>

                            <div className="bg-gray-800/50 rounded-lg p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">FUNCTIONAL</span>
                                    <h3 className="text-white font-semibold">Functional Cookies</h3>
                                </div>
                                <p className="text-gray-400 text-sm">
                                    Remember your preferences like theme and last selected options.
                                </p>
                            </div>

                            <div className="bg-gray-800/50 rounded-lg p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded">ANALYTICS</span>
                                    <h3 className="text-white font-semibold">Analytics Cookies</h3>
                                </div>
                                <p className="text-gray-400 text-sm">
                                    Help us understand how visitors use our site (anonymised data).
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Third-Party Services</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded">
                                <span className="text-white">Clerk (Authentication)</span>
                                <a href="https://clerk.com/privacy" className="text-purple-400 text-sm" target="_blank" rel="noopener noreferrer">Privacy →</a>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded">
                                <span className="text-white">Stripe (Payments)</span>
                                <a href="https://stripe.com/privacy" className="text-purple-400 text-sm" target="_blank" rel="noopener noreferrer">Privacy →</a>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded">
                                <span className="text-white">Vercel (Hosting)</span>
                                <a href="https://vercel.com/legal/privacy-policy" className="text-purple-400 text-sm" target="_blank" rel="noopener noreferrer">Privacy →</a>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Managing Cookies</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            You can control cookies through your browser settings:
                        </p>
                        <div className="grid md:grid-cols-2 gap-3">
                            <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" 
                               className="bg-gray-800/50 rounded p-3 hover:bg-gray-800 transition-colors">
                                <span className="text-white">Chrome</span>
                                <span className="text-purple-400 text-sm ml-2">→</span>
                            </a>
                            <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer"
                               className="bg-gray-800/50 rounded p-3 hover:bg-gray-800 transition-colors">
                                <span className="text-white">Firefox</span>
                                <span className="text-purple-400 text-sm ml-2">→</span>
                            </a>
                            <a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer"
                               className="bg-gray-800/50 rounded p-3 hover:bg-gray-800 transition-colors">
                                <span className="text-white">Safari</span>
                                <span className="text-purple-400 text-sm ml-2">→</span>
                            </a>
                            <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge" target="_blank" rel="noopener noreferrer"
                               className="bg-gray-800/50 rounded p-3 hover:bg-gray-800 transition-colors">
                                <span className="text-white">Edge</span>
                                <span className="text-purple-400 text-sm ml-2">→</span>
                            </a>
                        </div>
                        <p className="text-yellow-400 text-sm mt-4">
                            ⚠️ Disabling essential cookies may prevent some features from working.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Contact Us</h2>
                        <p className="text-gray-300">
                            Questions? Email us at{" "}
                            <a href="mailto:privacy@smartprintsuk.com" className="text-purple-400 hover:text-purple-300">
                                privacy@smartprintsuk.com
                            </a>
                        </p>
                    </section>
                </div>
            </main>

            <footer className="border-t border-gray-800 py-8 mt-12">
                <div className="container mx-auto px-4 text-center text-gray-400">
                    <div className="flex justify-center gap-6 mb-4">
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/refund" className="hover:text-white transition-colors">Refund</Link>
                    </div>
                    <p>© {new Date().getFullYear()} SmartPrints UK. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}