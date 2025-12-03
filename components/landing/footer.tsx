import Link from "next/link";
import { Printer } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-gray-800 bg-[#0f1117] relative z-50">
            <div className="container px-4 md:px-8 py-12 md:py-16 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                                <Printer className="h-5 w-5" />
                            </div>
                            <span className="text-lg font-bold tracking-tight text-white">SmartPrints UK</span>
                        </Link>
                        <p className="text-gray-400 max-w-sm mb-6">
                            Empowering parents with instant, personalised educational resources.
                            Making learning fun and screen-free.
                        </p>
                        <div className="text-sm text-gray-500">
                            &copy; {new Date().getFullYear()} SmartPrints UK. All rights reserved.
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-white">Legal</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/terms" className="hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/refund" className="hover:text-indigo-400 transition-colors">Refund Policy</Link></li>
                            <li><Link href="/cookies" className="hover:text-indigo-400 transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-white">Support</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="mailto:support@smartprintsuk.com" className="hover:text-indigo-400 transition-colors">Contact Us</a></li>
                            <li><Link href="/support" className="hover:text-indigo-400 transition-colors">Help Centre</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}
