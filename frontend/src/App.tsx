import { Header } from "./components/Header";
import { VentasProvider } from "./context/VentasContext";
import { VentasPage } from "./pages/VentasPage";

export function App() {
  return (
    <VentasProvider>
      <Header />
      <VentasPage />
    </VentasProvider>
  );
}
