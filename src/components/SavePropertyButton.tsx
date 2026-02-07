"use client";

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { toggleSaveProperty } from '@/lib/actions';
import { useRouter } from 'next/navigation';

interface SavePropertyButtonProps {
    propertyId: string;
    propertyTitle: string;
    initialSaved: boolean;
}

export default function SavePropertyButton({ propertyId, propertyTitle, initialSaved }: SavePropertyButtonProps) {
    const { user } = useUser();
    const router = useRouter();
    const [saved, setSaved] = useState(initialSaved);
    const [isToggling, setIsToggling] = useState(false);

    const handleToggleSave = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            router.push('/sign-in');
            return;
        }

        if (isToggling) return;

        setIsToggling(true);
        // Optimistic update
        setSaved(!saved);

        const result = await toggleSaveProperty(propertyTitle, propertyId, user.id, saved);

        if (result.error) {
            // Rollback on error
            setSaved(saved);
            alert(result.error);
        } else {
            setSaved(!!result.saved);
        }

        setIsToggling(false);
    };

    useEffect(() => {
        setSaved(initialSaved);
    }, [initialSaved]);

    return (
        <button
            onClick={handleToggleSave}
            disabled={isToggling}
            className={`p-2 cursor-pointer rounded-full backdrop-blur-md border transition-all duration-300 ${saved
                ? 'bg-pink-500 hover:bg-pink-600 text-white border-pink-500 shadow-lg shadow-pink-500/20 scale-110'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-pink-200 dark:hover:border-pink-900'
                }`}
            title={saved ? "Remove from Favorites" : "Add to Favorites"}
        >
            <Heart className={`h-5 w-5 ${saved ? 'fill-current' : ''}`} />
        </button>
    );
}
