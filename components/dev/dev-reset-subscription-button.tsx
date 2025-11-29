"use client";

import React, { useState } from "react";

export function DevResetSubscriptionButton() {
    const [loading, setLoading] = useState(false);

    // Only render in development
    if (process.env.NODE_ENV !== "development") {
        return null;
    }

    const handleReset = async () => {
        if (!confirm("Reset subscription and quotas for this user? (DEV only)")) {
            return;
        }

        try {
            setLoading(true);
            const res = await fetch("/api/dev/reset-subscription", {
                method: "POST",
            });

            if (!res.ok) {
                const text = await res.text();
                console.error("DEV reset error:", text);
                alert("Failed to reset subscription. Check console.");
                return;
            }

            if (typeof window !== "undefined") {
                // Clear all subscription and usage data
                localStorage.removeItem("smartprints_plan");
                localStorage.removeItem("smartprints_plus");
                localStorage.removeItem("user_is_pro");

                // Clear new limit keys
                localStorage.removeItem("sp_free_used");
                localStorage.removeItem("sp_basic_daily_count");
                localStorage.removeItem("sp_basic_daily_date");

                // Clear legacy keys just in case
                localStorage.removeItem("sp_free_usage");
                localStorage.removeItem("smartprints_free_generations_v1");

                // Clear other legacy keys that might still be around
                localStorage.removeItem("sp_images_used_today");
                localStorage.removeItem("sp_total_activities");

                // Clear daily usage keys (dynamic)
                const today = new Date().toISOString().split('T')[0];
                localStorage.removeItem(`smartprints_daily_usage_${today}`);

                // Force reload to reset state
                window.location.reload();
            }

            alert("Subscription and quotas reset. You are back to FREE state.");
            // Optional: force reload
            window.location.reload();
        } catch (err) {
            console.error("DEV reset exception:", err);
            alert("Failed to reset subscription. Check console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="mt-6 inline-flex items-center rounded-md border border-red-400 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 shadow-sm hover:bg-red-100"
        >
            {loading ? "Resetting..." : "DEV: Reset subscription"}
        </button>
    );
}
