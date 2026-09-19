import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createApp } from "./app.js";
import { SqliteVentasRepository } from "./repositories/sqliteVentasRepository.js";

const port = Number(process.env.PORT) || 3001;
const dataDir = join(dirname(fileURLToPath(import.meta.url)), "../data");
mkdirSync(dataDir, { recursive: true });

const repo = new SqliteVentasRepository(join(dataDir, "ventas.db"));
const app = createApp(repo);

app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
  console.log(`OpenAPI: http://localhost:${port}/docs`);
});
