"use client";

import { useState } from 'react';
import { Mail, Phone, User, Send } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { submitLead } from '@/lib/actions';

interface InquiryFormProps {
    propertyId: string;
    propertyName: string;
}

export default function InquiryForm({ propertyId, propertyName }: InquiryFormProps) {
    const { user } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        formData.append("propertyId", propertyId);
        if (user) {
            formData.append("clerkUserId", user.id);
        }

        const result = await submitLead(formData);

        setIsSubmitting(false);
        if (result.success) {
            setSuccess(true);
        } else {
            setError(result.error || "Something went wrong. Please try again.");
        }
    };

    if (success) {
        return (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-8 rounded-2xl text-center">
                <div className="bg-green-100 dark:bg-green-800 p-3 rounded-full w-fit mx-auto mb-4">
                    <Send className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Inquiry Sent!</h3>
                <p className="text-green-800 dark:text-green-300">
                    Thank you for your interest in {propertyName}. Our agent will contact you shortly.
                </p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-6 text-sm font-semibold text-green-700 dark:text-green-400 hover:underline"
                >
                    Send another inquiry
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl premium-shadow">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Request a Tour</h3>
            <p className="text-muted-foreground mb-8 text-sm">
                Fill out the form below and ours experts will get back to you within 24 hours.
            </p>

            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            required
                            name="leadName"
                            type="text"
                            defaultValue={user?.fullName || ""}
                            placeholder="John Doe"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            required
                            name="leadEmail"
                            type="email"
                            defaultValue={user?.primaryEmailAddress?.emailAddress || ""}
                            placeholder="john@example.com"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Phone (Optional)</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            name="leadPhone"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Message</label>
                    <textarea
                        name="message"
                        rows={4}
                        placeholder="I'm interested in this property and would like to schedule a viewing..."
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    ></textarea>
                </div>

                <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-4 bg-primary hover:bg-accent text-primary font-bold rounded-xl transition-all shadow-lg hover:shadow-primary/20 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <Send className="h-4 w-4" />
                            <span>Send Inquiry</span>
                        </>
                    )}
                </button>
            </form>

            <p className="mt-4 text-[10px] text-center text-slate-500 uppercase tracking-widest">
                By clicking send, you agree to our terms of service
            </p>
        </div>
    );
}

