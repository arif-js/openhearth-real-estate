import Hero from "@/components/Hero";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedProperties, getProperties } from "@/lib/api";
import PropertyGrid from "@/components/PropertyGrid";

export default async function Home() {
  const properties = await getProperties({}, true);
  const featuredProperties = await getFeaturedProperties();

  return (
    <div className="flex flex-col gap-16">
      <Hero properties={properties.properties} />

      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Featured Properties
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Hand-picked luxury homes and modern apartments curated just for you.
              Explore our top-rated listings.
            </p>
          </div>
          <Link
            href="/properties"
            className="group flex items-center gap-2 text-primary font-semibold hover:text-accent transition-colors"
          >
            Explore All Listings
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <PropertyGrid properties={featuredProperties} />
      </section>

      <section className="bg-slate-900 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
              Ready to find your next home?
            </h2>
            <p className="text-lg text-slate-400 mb-10">
              Join thousands of happy homeowners who found their perfect match through OpenHearth.
              Create an account to save properties and get expert advice.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/sign-up"
                className="bg-primary hover:bg-accent text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/20"
              >
                Get Started Now
              </Link>
              <Link
                href="/properties"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3.5 rounded-xl font-bold transition-all"
              >
                Browse Listings
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
