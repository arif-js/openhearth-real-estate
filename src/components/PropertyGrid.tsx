import PropertyCard from './PropertyCard';
import { AirtableProperty } from '@/types/airtable';

interface PropertyGridProps {
    properties: Partial<AirtableProperty>[];
}

export default function PropertyGrid({ properties }: PropertyGridProps) {
    if (!properties || properties.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-full mb-6">
                    <svg className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No properties found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {properties.map((property, index) => (
                <PropertyCard key={property.Record_ID || index} property={property} />
            ))}
        </div>
    );
}
