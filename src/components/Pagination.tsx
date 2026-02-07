"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const createQueryString = useCallback(
        (page: number) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", page.toString());
            return params.toString();
        },
        [searchParams]
    );

    if (totalPages <= 1) return null;

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        router.push(`/properties?${createQueryString(page)}`);
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-12">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    // Basic pagination logic to only show near current page if many pages exist
                    if (
                        totalPages > 7 &&
                        pageNum !== 1 &&
                        pageNum !== totalPages &&
                        Math.abs(pageNum - currentPage) > 2
                    ) {
                        if (pageNum === 2 || pageNum === totalPages - 1) {
                            return <span key={pageNum} className="px-2">...</span>;
                        }
                        return null;
                    }

                    return (
                        <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${currentPage === pageNum
                                ? "bg-primary text-primary shadow-lg shadow-primary/20"
                                : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                                }`}
                        >
                            {pageNum}
                        </button>
                    );
                })}
            </div>

            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRight className="h-5 w-5" />
            </button>
        </div>
    );
}
