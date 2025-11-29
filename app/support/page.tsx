'use client';

import Link from 'next/link';

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-[#0f1117] text-white font-sans">
            {/* Navbar */}
            <nav className="border-b border-gray-800 bg-[#0f1117]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        <span className="font-bold text-lg">SmartPrints UK</span>
                    </Link>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold mb-8">Support</h1>
                
                <div className="space-y-8">
                    {/* Contact Section */}
                    <section className="bg-[#13161c] border border-gray-800 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold mb-4 text-indigo-400">Contact Us</h2>
                        <p className="text-gray-400 mb-6">
                            Need help? We&apos;re here to assist you with any questions about SmartPrints UK.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <a href="mailto:support@smartprintsuk.com" className="text-indigo-400 hover:underline">
                                    support@smartprintsuk.com
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="bg-[#13161c] border border-gray-800 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold mb-6 text-indigo-400">Frequently Asked Questions</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-bold text-lg mb-2">How do I generate an activity?</h3>
                                <p className="text-gray-400">
                                    Simply enter your child&apos;s name, select their age group, choose a topic, pick an activity type, and click &quot;Generate Activity PDF&quot;. Your personalised activity will be ready in seconds!
                                </p>
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-lg mb-2">How many activities can I create?</h3>
                                <p className="text-gray-400">
                                    Free users get 3 activities. Basic plan includes 50 activities per month, and Plus plan includes 150 activities per month.
                                </p>
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-lg mb-2">Can I download my activities as PDF?</h3>
                                <p className="text-gray-400">
                                    Yes! All activities can be downloaded as high-quality PDF files, ready to print.
                                </p>
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-lg mb-2">How do I cancel my subscription?</h3>
                                <p className="text-gray-400">
                                    You can cancel your subscription at any time by contacting us at support@smartprintsuk.com. Your access will continue until the end of your billing period.
                                </p>
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-lg mb-2">What age groups are supported?</h3>
                                <p className="text-gray-400">
                                    We support EYFS (ages 3-5), KS1 (ages 5-7), Lower KS2 (ages 7-9), and Upper KS2 (ages 9-11). Each activity is tailored to the appropriate difficulty level.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Links */}
                    <div className="flex gap-4 text-sm text-gray-500">
                        <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
                        <span>•</span>
                        <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
                        <span>•</span>
                        <Link href="/" className="hover:text-white transition">Back to Home</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}

