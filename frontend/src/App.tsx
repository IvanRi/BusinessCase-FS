const API_URL = import.meta.env.VITE_API_URL;

export function App() {
  return (
    <main>
      <h1>Ventas</h1>
      <p>API: {API_URL}</p>
    </main>
  );
}
