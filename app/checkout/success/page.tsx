"use client";

import { useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

function SuccessContent() {
    const searchParams = useSearchParams();
    const plan = (searchParams.get("plan") || "plus").toLowerCase();
    
    // Derive planLabel from plan without useState
    const planLabel = useMemo(() => {
        return plan === "basic" ? "SmartPrints Basic" : "SmartPrints Plus";
    }, [plan]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const normalizedPlan = plan === "basic" ? "BASIC" : "PLUS";

            // Store the specific plan
            localStorage.setItem("smartprints_plan", normalizedPlan);

            // Legacy support: only set smartprints_plus for PLUS plan
            if (normalizedPlan === "PLUS") {
                localStorage.setItem("smartprints_plus", "true");
            } else {
                localStorage.removeItem("smartprints_plus");
            }

            // Set generic pro flag for both
            localStorage.setItem("user_is_pro", "true");
        }
    }, [plan]);

    return (
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-3">Payment successful 🎉</h1>
            <p className="text-slate-600 mb-8">
                Your {planLabel} subscription is now active. Enjoy AI-powered activities tailored to your family.
            </p>

            <Link href="/generate">
                <Button className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700">
                    Go to Dashboard
                </Button>
            </Link>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-slate-50">
            <Suspense fallback={<div>Loading...</div>}>
                <SuccessContent />
            </Suspense>
        </main>
    );
}
