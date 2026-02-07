import { getProperties } from "@/lib/api";
import FilterBar from "@/components/FilterBar";
import PropertyGrid from "@/components/PropertyGrid";
import SortSelect from "@/components/SortSelect";
import Pagination from "@/components/Pagination";

interface SearchParams {
    [key: string]: string | string[] | undefined;
}

export default async function PropertiesPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const params = await searchParams;
    const q = typeof params.q === 'string' ? params.q : undefined;
    const beds = typeof params.beds === 'string' ? parseInt(params.beds) : undefined;
    const priceStr = typeof params.price === 'string' ? params.price : undefined;
    const status = typeof params.status === 'string' ? params.status : undefined;
    const sortBy = typeof params.sort === 'string' ? params.sort : 'newest';
    const page = typeof params.page === 'string' ? parseInt(params.page) : 1;

    let minPrice: number | undefined;
    let maxPrice: number | undefined;

    if (priceStr) {
        if (priceStr === '0-500000') {
            maxPrice = 500000;
        } else if (priceStr === '500000-1000000') {
            minPrice = 500000;
            maxPrice = 1000000;
        } else if (priceStr === '1000000-2000000') {
            minPrice = 1000000;
            maxPrice = 2000000;
        } else if (priceStr === '2000000-plus') {
            minPrice = 2000000;
        }
    }

    const { properties, total, totalPages } = await getProperties({
        search: q,
        bedrooms: beds,
        minPrice,
        maxPrice,
        status,
        sortBy,
        page,
        pageSize: 12,
    });

    return (
        <div className="min-h-screen bg-background">
            {/* Header spacing */}
            <div className="bg-slate-900 pt-16 pb-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Available Properties</h1>
                    <p className="text-slate-400">Discover your perfect home from our curated selection of premium listings.</p>
                </div>
            </div>

            <FilterBar />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div className="text-sm text-muted-foreground">
                        {total > 0 ? (
                            <>
                                Showing <span className="font-bold text-slate-900 dark:text-white">
                                    {(page - 1) * 12 + 1}-{Math.min(page * 12, total)}
                                </span> of <span className="font-bold text-slate-900 dark:text-white">{total}</span> results
                            </>
                        ) : (
                            "No results found"
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Sort by:</span>
                        <SortSelect />
                    </div>
                </div>

                <PropertyGrid properties={properties} />

                <Pagination currentPage={page} totalPages={totalPages} />
            </div>
        </div>
    );
}
