"use client";

import { Button } from "@/components/ui/button";
import { SignUpButton, SignInButton } from "@clerk/nextjs";
import { Sparkles, X } from "lucide-react";

interface SignupModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SignupModal({ open, onOpenChange }: SignupModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => onOpenChange(false)}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-lg shadow-2xl p-6 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
                {/* Close Button */}
                <button
                    onClick={() => onOpenChange(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <Sparkles className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        Get Unlimited SmartPrints
                    </h2>
                    <p className="text-slate-600">
                        You&apos;ve used your 3 free activities. Create a free account to keep generating personalised worksheets, colouring pages and stories.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-4">
                    <SignUpButton mode="modal">
                        <Button className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                            Create Free Account
                        </Button>
                    </SignUpButton>

                    <div className="text-center text-sm text-slate-600">
                        Already have an account?{" "}
                        <SignInButton mode="modal">
                            <button className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                                Log in
                            </button>
                        </SignInButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
