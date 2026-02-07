"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Bed, Bath, MapPin } from 'lucide-react';
import { AirtableProperty } from '@/types/airtable';
import { useUser } from '@clerk/nextjs';
import SavePropertyButton from './SavePropertyButton';
import { useEffect, useState } from 'react';

interface PropertyCardProps {
    property: Partial<AirtableProperty>;
}

export default function PropertyCard({ property }: PropertyCardProps) {
    const {
        Record_ID,
        Title,
        Slug,
        Clerk_User_IDs_FROM_SAVED_HOMES,
        Price,
        Images,
        Bedrooms,
        Status,
        State,
        Location,
    } = property;
    const { user } = useUser();
    const [saved, setSaved] = useState(false);
    const imageUrl = Images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

    useEffect(() => {
        if (user) {
            const isSaved = !!Clerk_User_IDs_FROM_SAVED_HOMES?.find((id) => id === user.id);
            setSaved(isSaved);
        }
    }, [user, Clerk_User_IDs_FROM_SAVED_HOMES]);

    return (
        <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden premium-shadow hover:border-primary/50 transition-all duration-300">
            {/* Property Image */}
            <div className="relative aspect-16/10 overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={Title || 'Property'}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${Status === 'Active' ? 'bg-green-500 text-white' :
                        Status === 'Pending' ? 'bg-amber-500 text-white' :
                            'bg-slate-500 text-white'
                        }`}>
                        {Status || 'Active'}
                    </span>
                </div>
                <div className="absolute top-4 right-4">
                    <SavePropertyButton
                        propertyId={Record_ID || ''}
                        propertyTitle={Title || ''}
                        initialSaved={saved}
                    />
                </div>
            </div>

            {/* Property Info */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
                        {Title || 'Luxury Modern Villa'}
                    </h3>
                </div>

                <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-4">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{Location || 'N/A'}, {State || 'N/A'}</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                            <Bed className="h-4 w-4 text-primary" />
                            <span>{Bedrooms || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Bath className="h-4 w-4 text-primary" />
                            <span>{Bedrooms ? Bedrooms - 1 : 0}</span>
                        </div>
                    </div>
                    <div className="text-xl font-bold text-primary">
                        ${Price?.toLocaleString() || '0,000'}
                    </div>
                </div>

                <Link
                    href={`/properties/${Record_ID || '#'}`}
                    className="mt-6 block w-full text-center py-3 bg-slate-50 dark:bg-slate-800 hover:bg-primary-900 hover:text-primary text-slate-900 dark:text-white font-semibold rounded-xl transition-all duration-300"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}

