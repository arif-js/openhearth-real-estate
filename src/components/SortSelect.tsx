"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export default function SortSelect() {
    const router = useRouter();
    const searchParams = useSearchParams();

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

    return (
        <select
            className="bg-transparent border-none text-sm font-bold focus:ring-0 cursor-pointer text-slate-900 dark:text-white"
            defaultValue={searchParams.get('sort') || 'newest'}
            onChange={(e) => {
                const query = createQueryString('sort', e.target.value);
                router.push(`/properties?${query}`);
            }}
        >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
        </select>
    );
}
