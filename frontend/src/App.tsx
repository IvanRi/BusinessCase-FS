import { VentasProvider } from "./context/VentasContext";
import { VentasPage } from "./pages/VentasPage";

export function App() {
  return (
    <VentasProvider>
      <VentasPage />
    </VentasProvider>
  );
}
