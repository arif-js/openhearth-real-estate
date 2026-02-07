import { getPropertyById } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    Bed,
    Bath,
    Maximize,
    MapPin,
    ChevronLeft,
    Share2,
    Calendar,
    CheckCircle2
} from "lucide-react";
import InquiryForm from "@/components/InquiryForm";
import SavePropertyButton from "@/components/SavePropertyButton";
import { auth } from "@clerk/nextjs/server";

interface PropertyPageProps {
    params: Promise<{ id: string }>;
}

export default async function PropertyPage({ params }: PropertyPageProps) {
    const { id } = await params;
    const { userId } = await auth();
    const property = await getPropertyById(id);

    if (!property) {
        notFound();
    }

    const isSaved = property.Clerk_User_IDs_FROM_SAVED_HOMES?.includes(userId || '') || false;

    const images = property.Images || [];
    const mainImage = images[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';

    return (
        <div className="bg-background pb-20">
            {/* Navigation & Actions */}
            <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-16 z-30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <Link
                        href="/properties"
                        className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back to Listings
                    </Link>
                    <div className="flex items-center gap-3">
                        <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <Share2 className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        </button>
                        <SavePropertyButton propertyId={id} propertyTitle={property.Title} initialSaved={isSaved} />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Main Content (Left) */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Gallery Section */}
                        <div className="space-y-4">
                            <div className="relative aspect-16/10 rounded-3xl overflow-hidden premium-shadow">
                                <Image
                                    src={mainImage}
                                    alt={property.Title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                {images.slice(1, 4).map((img, i) => (
                                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                                        <Image src={img.url} alt={`${property.Title} ${i + 2}`} fill className="object-cover" />
                                    </div>
                                ))}
                                {images.length > 4 && (
                                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center text-white cursor-pointer group">
                                        <Image src={images[4].url} alt="more" fill className="object-cover opacity-40 group-hover:scale-110 transition-transform" />
                                        <span className="relative z-10 font-bold text-lg">+{images.length - 4} More</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Title & Stats */}
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full">
                                            {property.Status}
                                        </span>
                                        <span className="text-muted-foreground text-sm flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            Listed 2 days ago
                                        </span>
                                    </div>
                                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                        {property.Title}
                                    </h1>
                                    <div className="flex items-center gap-2 text-muted-foreground mt-2">
                                        <MapPin className="h-5 w-5 text-primary" />
                                        <span className="text-lg">{property.Location || 'N/A'}, {property.State || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="text-4xl font-black text-primary">
                                    ${property.Price?.toLocaleString()}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-8 py-8 border-y border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-primary">
                                        <Bed className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold">{property.Bedrooms}</div>
                                        <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Bedrooms</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-primary">
                                        <Bath className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold">{property.Bedrooms - 1}</div>
                                        <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Bathrooms</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-primary">
                                        <Maximize className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold">4,500</div>
                                        <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Sq Ft</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">About Property</h2>
                            <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                                {property.Description || "No description available."}
                            </div>
                        </div>

                        {/* Amenities */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Key Amenities</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                {property.Amenities?.split(',').map((item) => (
                                    <div key={item} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        <span className="font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Map Section */}
                        {property.Latitude && property.Longitude && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Property Location</h2>
                                <div className="w-full h-[400px] rounded-3xl overflow-hidden premium-shadow border border-slate-200 dark:border-slate-800">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        src={`https://maps.google.com/maps?q=${property.Latitude},${property.Longitude}&z=15&output=embed`}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="space-y-8">
                        <InquiryForm propertyId={property.Record_ID} propertyName={property.Title} />

                        {/* Agent Card */}
                        <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-6">Listing Agent</h3>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-slate-800 border-2 border-primary/30">
                                        <Image
                                            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                                            alt="Agent"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold">Richard Hendricks</div>
                                        <div className="text-primary text-sm font-semibold italic">Senior Realtor</div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <button className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors">
                                        Contact Agent
                                    </button>
                                    <button className="w-full py-3 border border-white/20 hover:bg-white/5 font-bold rounded-xl transition-colors">
                                        View Other Listings
                                    </button>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -mr-16 -mt-16"></div>
                        </div>
                    </div>

                </div>
            </div>
        </div >
    );
}
