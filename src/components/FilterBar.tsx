"use client";
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

export default function FilterBar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [isPending, setIsPending] = useState(false);

    // Update URL with search params
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            return params.toString();
        },
        [searchParams]
    );

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery !== (searchParams.get('q') || '')) {
                const queryString = createQueryString('q', searchQuery);
                router.push(`/properties?${queryString}`);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, searchParams, router, createQueryString]);

    return (
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-16 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex-grow max-w-md relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by city, state, or property name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative group">
                            <select
                                className="appearance-none flex items-center gap-2 px-4 py-2 pr-10 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors cursor-pointer focus:ring-0"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    const query = createQueryString('price', val === 'any' ? '' : val);
                                    router.push(`/properties?${query}`);
                                }}
                                defaultValue={searchParams.get('price') || 'any'}
                            >
                                <option value="any">Price Range</option>
                                <option value="0-500000">Up to $500k</option>
                                <option value="500000-1000000">$500k - $1M</option>
                                <option value="1000000-2000000">$1M - $2M</option>
                                <option value="2000000-plus">$2M+</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        </div>

                        <div className="relative group">
                            <select
                                className="appearance-none flex items-center gap-2 px-4 py-2 pr-10 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors cursor-pointer focus:ring-0"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    const query = createQueryString('beds', val === 'any' ? '' : val);
                                    router.push(`/properties?${query}`);
                                }}
                                defaultValue={searchParams.get('beds') || 'any'}
                            >
                                <option value="any">Any Bedrooms</option>
                                <option value="1">1+ Beds</option>
                                <option value="2">2+ Beds</option>
                                <option value="3">3+ Beds</option>
                                <option value="4">4+ Beds</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        </div>

                        <div className="relative group">
                            <select
                                className="appearance-none flex items-center gap-2 px-4 py-2 pr-10 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors cursor-pointer focus:ring-0"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    const query = createQueryString('status', val === 'any' ? '' : val);
                                    router.push(`/properties?${query}`);
                                }}
                                defaultValue={searchParams.get('status') || 'any'}
                            >
                                <option value="any">Any Status</option>
                                <option value="Active">Active</option>
                                <option value="Pending">Pending</option>
                                <option value="Sold">Sold</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
