import { auth } from "@clerk/nextjs/server";
import { getSavedProperties } from "@/lib/api";
import PropertyGrid from "@/components/PropertyGrid";
import { Heart, Home, ArrowRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const savedProperties = await getSavedProperties(userId);

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="bg-slate-900 pt-16 pb-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                        <div className="h-20 w-20 rounded-3xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
                            <Heart className="h-10 w-10 fill-current" color="white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tight mb-2">My Saved Homes</h1>
                            <p className="text-slate-400 text-lg">Manage and track your interested properties in one place.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 premium-shadow border border-slate-200 dark:border-slate-800">
                    {savedProperties.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="bg-slate-50 dark:bg-slate-800 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-8">
                                <Home className="h-10 w-10 text-slate-300" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">No saved homes yet</h2>
                            <p className="text-muted-foreground max-w-md mx-auto mb-10 text-lg">
                                Explore our collection of premium listings and click the heart icon to save them to your dashboard.
                            </p>
                            <Link
                                href="/properties"
                                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-accent text-primary px-10 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-primary/20"
                            >
                                Start Browsing
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    Collections ({savedProperties.length})
                                </h2>
                                <div className="text-sm text-muted-foreground font-medium">
                                    Last updated today
                                </div>
                            </div>

                            <PropertyGrid properties={savedProperties} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
