import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
    return (
        <section className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
            <div className="container px-4 md:px-8 relative z-10">
                <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
                    <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-background text-primary mb-4">
                        <Sparkles className="mr-2 h-4 w-4 fill-secondary text-secondary" />
                        <span className="text-muted-foreground">AI-Powered Learning for UK Kids</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                        Turn Screen Time into <span className="text-primary">Brain Time</span>
                    </h1>
                    <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
                        Instantly generate personalised worksheets for your child&apos;s age and interests.
                        Aligned with the UK National Curriculum.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <Button size="lg" className="h-12 px-8 text-lg gap-2">
                            Get Started for Free
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                            View Sample PDF
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                        No credit card required. 100% free to try.
                    </p>
                </div>
            </div>

            {/* Decorative blobs */}
            <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
            <div className="absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        </section>
    );
}
