import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f1117]">
            <SignIn
                appearance={{
                    elements: {
                        rootBox: "mx-auto",
                        card: "bg-[#1a1d26] border border-gray-800 shadow-2xl",
                        headerTitle: "text-white",
                        headerSubtitle: "text-gray-400",
                        socialButtonsBlockButton: "bg-[#13161c] border-gray-700 text-white hover:bg-gray-700",
                        formButtonPrimary: "bg-indigo-600 hover:bg-indigo-500",
                        footerActionLink: "text-indigo-400 hover:text-indigo-300",
                        formFieldLabel: "text-gray-300",
                        formFieldInput: "bg-[#0f1117] border-gray-700 text-white",
                        identityPreviewText: "text-white",
                        identityPreviewEditButton: "text-indigo-400",
                    }
                }}
                routing="path"
                path="/sign-in"
                signUpUrl="/sign-up"
            />
        </div>
    );
}
