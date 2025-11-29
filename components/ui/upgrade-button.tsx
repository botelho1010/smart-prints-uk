"use client";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UpgradeButtonProps {
    fullWidth?: boolean;
    plan?: "FREE" | "BASIC" | "PLUS";
}

export function UpgradeButton({ fullWidth = false, plan = "FREE" }: UpgradeButtonProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleUpgrade = async () => {
        if (plan === "FREE") {
            // Free users go to pricing section to choose
            router.push("/#pricing");
            return;
        }

        if (plan === "BASIC") {
            // Basic users upgrade to Plus
            setIsLoading(true);
            try {
                const response = await fetch("/api/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ plan: "plus" }),
                });
                const data = await response.json();
                if (data.url) {
                    window.location.href = data.url;
                } else {
                    console.error("No checkout URL returned");
                    alert("Unable to start checkout. Please try again.");
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Upgrade failed:", error);
                alert("Unable to start checkout. Please try again.");
                setIsLoading(false);
            }
        }
    };

    const label = plan === "BASIC" ? "Upgrade to Plus" : "Upgrade to Continue";

    return (
        <Button
            onClick={handleUpgrade}
            className={`${fullWidth ? "w-full" : ""} bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg transition-all hover:scale-105`}
            disabled={isLoading}
        >
            <Sparkles className="mr-2 h-4 w-4" />
            {isLoading ? "Loading..." : label}
        </Button>
    );
}

export default UpgradeButton;
