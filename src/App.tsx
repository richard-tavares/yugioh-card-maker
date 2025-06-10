import { CardProvider } from "@/context/CardContext";
import DefaultLayout from "@/layouts/DefaultLayout";
import CardCanvas from "@/components/CardCanvas";
import CardForm from "@/components/CardForm";

function App() {
  return (
    <CardProvider>
      <DefaultLayout>
        <div className="flex flex-wrap justify-center items-start w-full gap-y-4">
          <CardCanvas />
          <CardForm />
        </div>
      </DefaultLayout>
    </CardProvider >
  );
}

export default App;
