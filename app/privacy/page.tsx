import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function PrivacyPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
                <h1 className="text-3xl font-bold mb-8 text-slate-900">Privacy Policy</h1>

                <div className="prose prose-slate max-w-none text-slate-800">
                    <p className="lead">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>

                    <p>
                        At SmartPrints UK, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our service.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-4">1. Information We Collect</h2>
                    <p>
                        We collect information that you provide directly to us, including:
                    </p>
                    <ul className="list-disc pl-6 mb-4">
                        <li><strong>Account Information:</strong> When you sign up via Clerk, we receive your email address and authentication details.</li>
                        <li><strong>Usage Data:</strong> We collect the inputs you provide (e.g., child&apos;s name, age group, topics) to generate the worksheets.</li>
                        <li><strong>Payment Information:</strong> All payment processing is handled securely by Stripe. We do not store your full credit card details on our servers.</li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-6 mb-4">2. How We Use Your Information</h2>
                    <p>
                        We use the information we collect to:
                    </p>
                    <ul className="list-disc pl-6 mb-4">
                        <li>Provide, maintain, and improve our services.</li>
                        <li>Generate personalised educational content using AI technology.</li>
                        <li>Process your subscription payments.</li>
                        <li>Communicate with you about your account and updates to our service.</li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-6 mb-4">3. Data Security</h2>
                    <p>
                        We implement appropriate technical and organizational measures to protect your personal data. We use trusted third-party providers for critical functions:
                    </p>
                    <ul className="list-disc pl-6 mb-4">
                        <li><strong>Authentication:</strong> Handled by Clerk.</li>
                        <li><strong>Payments:</strong> Handled by Stripe.</li>
                        <li><strong>AI Generation:</strong> Content is generated using Google Gemini API. We do not use your personal data to train public AI models without your consent.</li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-6 mb-4">4. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at support@smartprints.uk.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
