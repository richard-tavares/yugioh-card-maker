export default function Header() {
    return (
        <header className="fixed top-0 left-0 w-full h-14 bg-black text-white flex items-center px-4 shadow z-10">
            <img src="/images/logo.png" width="40" alt="logo" className="mx-2"></img>
            <h1 className="text-xl font-bold">Yu-Gi-Oh! Card Maker</h1>
        </header>
    );
}
