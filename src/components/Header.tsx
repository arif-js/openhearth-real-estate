import Link from 'next/link';
import { SignInButton, SignOutButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Home, Heart, LayoutDashboard, Search } from 'lucide-react';

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="p-1.5 bg-primary rounded-lg group-hover:bg-accent transition-colors">
                                <Home className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Open<span className="text-primary">Hearth</span>
                            </span>
                        </Link>
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            href="/properties"
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                        >
                            <Search className="h-4 w-4" />
                            Browse Homes
                        </Link>
                        <SignedIn>
                            <Link
                                href="/dashboard"
                                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                            </Link>
                        </SignedIn>
                    </nav>

                    <div className="flex items-center gap-4">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="inline-flex cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                                    Sign In
                                </button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <div className="flex items-center gap-3">
                                <UserButton
                                    afterSignOutUrl="/"
                                    appearance={{
                                        elements: {
                                            avatarBox: "h-9 w-9"
                                        }
                                    }}
                                />
                            </div>
                        </SignedIn>
                    </div>
                </div>
            </div>
        </header>
    );
}
