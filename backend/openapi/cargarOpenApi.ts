import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { load as loadYaml } from "js-yaml";

function leerYaml(ruta: string): unknown {
  const loaded = loadYaml(readFileSync(ruta, "utf8"));
  if (typeof loaded === "undefined") {
    throw new Error(`YAML vacío: ${ruta}`);
  }
  return loaded;
}

function puntero(doc: unknown, fragmento: string): unknown {
  const partes = fragmento.split("/").filter(Boolean);
  let actual = doc;
  for (const parte of partes) {
    if (typeof actual !== "object" || actual === null || !(parte in actual)) {
      throw new Error(`Puntero inválido: #/${fragmento}`);
    }
    actual = (actual as Record<string, unknown>)[parte];
  }
  return actual;
}

function resolver(nodo: unknown, baseDir: string): unknown {
  if (Array.isArray(nodo)) {
    return nodo.map((item) => resolver(item, baseDir));
  }

  if (nodo === null || typeof nodo !== "object") {
    return nodo;
  }

  const obj = nodo as Record<string, unknown>;
  const ref = obj.$ref;
  if (typeof ref === "string" && !ref.startsWith("#")) {
    const [archivo, fragmento] = ref.split("#") as [string, string | undefined];
    const absoluta = resolve(baseDir, archivo);
    const destino = fragmento ? puntero(leerYaml(absoluta), fragmento) : leerYaml(absoluta);
    return resolver(destino, dirname(absoluta));
  }

  const salida: Record<string, unknown> = {};
  for (const [clave, valor] of Object.entries(obj)) {
    salida[clave] = resolver(valor, baseDir);
  }
  return salida;
}

export function cargarOpenApi(ruta: string): object {
  const cargado = resolver(leerYaml(ruta), dirname(ruta));
  if (typeof cargado !== "object" || cargado === null) {
    throw new Error("openapi.yaml inválido");
  }
  return cargado;
}
