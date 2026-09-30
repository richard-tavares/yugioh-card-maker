import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function PageLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <div className="min-h-screen flex flex-col bg-slate-950 text-white">
            <Header />
            <main className="flex-1 container mx-auto pt-16 pb-4">
                {children}
            </main>
            <Footer />
        </div>
    );
}
