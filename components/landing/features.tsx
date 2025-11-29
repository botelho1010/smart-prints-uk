import { Brain, Download, GraduationCap, Wand2 } from "lucide-react";

const features = [
    {
        title: "AI-Powered Personalisation",
        description: "Create unique worksheets tailored to your child's specific interests, whether it's dinosaurs, space, or football.",
        icon: Wand2,
        color: "text-purple-500",
        bg: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
        title: "UK Curriculum Aligned",
        description: "Content designed to support Early Years Foundation Stage (EYFS) and Key Stages 1 & 2.",
        icon: GraduationCap,
        color: "text-primary",
        bg: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
        title: "Instant PDF Download",
        description: "Get high-quality, printable PDFs in seconds. Perfect for rainy weekends or homework help.",
        icon: Download,
        color: "text-green-500",
        bg: "bg-green-100 dark:bg-green-900/20",
    },
    {
        title: "Distraction-Free Learning",
        description: "Bring focus back to pen and paper. No ads, no screens, just pure learning engagement.",
        icon: Brain,
        color: "text-secondary-foreground",
        bg: "bg-secondary/20",
    },
];

export function Features() {
    return (
        <section id="features" className="py-20 md:py-32 bg-background">
            <div className="container px-4 md:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
                        Why Parents Love <span className="text-primary">SmartPrints</span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        We combine advanced AI with educational expertise to create resources that children actually want to complete.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center text-center p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
                            <div className={`h-14 w-14 rounded-xl flex items-center justify-center mb-6 ${feature.bg}`}>
                                <feature.icon className={`h-7 w-7 ${feature.color}`} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
