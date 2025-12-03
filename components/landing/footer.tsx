import Link from "next/link";
import { Printer } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t bg-muted/30 relative z-50">
            <div className="container px-4 md:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <Printer className="h-5 w-5" />
                            </div>
                            <span className="text-lg font-bold tracking-tight text-primary">SmartPrints UK</span>
                        </Link>
                        <p className="text-muted-foreground max-w-sm mb-6">
                            Empowering parents with instant, personalised educational resources.
                            Making learning fun and screen-free.
                        </p>
                        <div className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} SmartPrints UK. All rights reserved.
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/refund" className="hover:text-primary transition-colors">Refund Policy</Link></li>
                            <li><Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><a href="mailto:support@smartprintsuk.com" className="hover:text-primary transition-colors">Contact Us</a></li>
                            <li><Link href="/support" className="hover:text-primary transition-colors">Help Centre</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}
