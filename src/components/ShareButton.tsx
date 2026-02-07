"use client";

import { Share2, Check } from 'lucide-react';
import { useState } from 'react';

export default function ShareButton() {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: document.title,
                    url: url,
                });
            } catch (err) {
                console.error('Error sharing:', err);
                copyToClipboard(url);
            }
        } else {
            copyToClipboard(url);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="relative">
            <button
                onClick={handleShare}
                className="p-2 cursor-pointer rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group flex items-center justify-center"
                title="Share property"
            >
                {copied ? (
                    <Check className="h-5 w-5 text-green-500" />
                ) : (
                    <Share2 className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors" />
                )}
            </button>
            {copied && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-1 px-3 rounded-lg shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                    Link Copied!
                </div>
            )}
        </div>
    );
}
