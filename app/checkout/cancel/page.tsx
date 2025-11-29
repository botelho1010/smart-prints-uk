import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function CheckoutCancelPage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-slate-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                    <XCircle className="h-10 w-10 text-slate-600" />
                </div>

                <h1 className="text-3xl font-bold text-slate-900 mb-3">Payment cancelled</h1>
                <p className="text-slate-600 mb-8">
                    You can continue using your free activities or choose a plan later.
                </p>

                <Link href="/#pricing">
                    <Button variant="outline" className="w-full h-12 text-base font-semibold">
                        Back to Pricing
                    </Button>
                </Link>
            </div>
        </main>
    );
}
