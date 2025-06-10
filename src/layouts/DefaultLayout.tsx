import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function DefaultLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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
