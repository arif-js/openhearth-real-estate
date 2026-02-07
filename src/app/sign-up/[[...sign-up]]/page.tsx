import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4">
            <SignUp />
        </div>
    );
}
