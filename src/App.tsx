import { CardProvider } from "@/context/CardContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CardCanvas from "@/components/CardCanvas";
import CardForm from "@/components/CardForm";

function App() {
  return (
    <CardProvider>
      <div className="h-screen flex flex-col">
        <Header />
        <div className="flex flex-1 pt-14 pb-10">
          <aside className="w-1/3 bg-slate-950 flex items-center justify-center">
            <CardCanvas />
          </aside>
          <main className="w-2/3 bg-slate-950 text-white p-5">
            <CardForm />
          </main>
        </div>
        <Footer />
      </div>
    </CardProvider>
  );
}

export default App;
