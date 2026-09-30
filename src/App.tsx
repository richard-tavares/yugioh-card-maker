import { CardForm } from "@/components/card/CardForm";
import { CardPreview } from "@/components/card/CardPreview";
import { PageLayout } from "@/components/layout/PageLayout";
import { CardProvider } from "@/contexts/CardProvider";

export function App() {
    return (
        <CardProvider>
            <PageLayout>
                <div className="flex flex-wrap justify-center items-start w-full gap-y-4">
                    <CardPreview />
                    <CardForm />
                </div>
            </PageLayout>
        </CardProvider>
    );
}
