"use client";
import { Search, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AirtableProperty } from '@/types/airtable';
import dynamic from 'next/dynamic';

const PropertyMap = dynamic(() => import('./PropertyMap'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-slate-800 animate-pulse flex items-center justify-center text-slate-400">Loading Map...</div>
});

interface HeroProps {
    properties?: AirtableProperty[];
}

export default function Hero({ properties = [] }: HeroProps) {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = () => {
        if (query.trim()) {
            router.push(`/properties?q=${encodeURIComponent(query.trim())}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="relative overflow-hidden bg-slate-900 py-16 sm:py-24">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-linear-to-b from-slate-900/80 via-slate-900/60 to-slate-900"></div>
                <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-30"></div>
            </div>

            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl mb-6 leading-[1.1]">
                            Find the place where <br />
                            <span className="text-primary italic">memories</span> begin.
                        </h1>
                        <p className="text-lg leading-8 text-slate-300 mb-10 max-w-xl">
                            OpenHearth simplifies your real estate journey. Discover high-quality listings,
                            save your favorites, and connect with expert agents—all in one place.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl">
                            <div className="flex-1 flex items-center gap-3 px-4 w-full">
                                <MapPin className="h-5 w-5 text-primary" color='white' />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Search by city, state, or property name..."
                                    className="w-full bg-transparent outline-none focus:border-none border-none text-white placeholder:text-slate-400 focus:ring-0 text-md py-3"
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                className="w-full cursor-pointer sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-accent text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-primary/20"
                            >
                                <Search className="h-5 w-5" />
                                <span>Search</span>
                            </button>
                        </div>

                        <div className="mt-8 flex items-center gap-8 text-sm text-slate-400">
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-white">12k+</span>
                                <span>Properties</span>
                            </div>
                            <div className="h-10 w-px bg-slate-700"></div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-white">4.8/5</span>
                                <span>Rating</span>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Map Side */}
                    <div className="relative hidden lg:block h-[500px] w-full bg-slate-800 rounded-3xl overflow-hidden premium-shadow border-none group">
                        <PropertyMap properties={properties} />
                    </div>
                </div>
            </div>
        </div>
    );
}
