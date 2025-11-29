import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Printer className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-primary">SmartPrints UK</span>
                    </Link>
                </div>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="#features" className="transition-colors hover:text-primary">Features</Link>
                    <Link href="#pricing" className="transition-colors hover:text-primary">Pricing</Link>
                    <Link href="#about" className="transition-colors hover:text-primary">About</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <SignedOut>
                        <SignInButton mode="modal">
                            <Button variant="ghost">Log in</Button>
                        </SignInButton>
                        <Link href="/sign-up">
                            <Button>Get Started</Button>
                        </Link>
                    </SignedOut>
                    <SignedIn>
                        <Link href="/generate">
                            <Button variant="ghost" className="mr-2">Dashboard</Button>
                        </Link>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                </div>
            </div>
        </header>
    );
}
