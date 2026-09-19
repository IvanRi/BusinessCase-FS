import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { crearVenta } from "../../api/ventas";
import { ApiError } from "../../api/client";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Modal } from "../../components/Modal";
import { Select } from "../../components/Select";
import { Toast, type TonoToast } from "../../components/Toast";
import { useVentas } from "../../context/VentasContext";
import { esquemaVenta, type FormularioVenta } from "../../helpers/ventaSchema";
import type { MedioPago, Venta } from "../../tipos";

const MEDIOS: MedioPago[] = ["efectivo", "tarjeta", "transferencia"];

interface Aviso {
  mensaje: string;
  tono: TonoToast;
}

function valoresVacios(fecha: string): FormularioVenta {
  return {
    id_venta: "",
    fecha,
    cliente: "",
    producto: "",
    cantidad: 1,
    importe: Number.NaN,
    medio_pago: "efectivo",
  };
}

export function AltaVenta() {
  const { rango, recargar } = useVentas();
  const [abierto, setAbierto] = useState(false);
  const [aviso, setAviso] = useState<Aviso | undefined>(undefined);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormularioVenta>({
    resolver: yupResolver(esquemaVenta),
    defaultValues: valoresVacios(rango.desde),
  });

  const cerrar = useCallback(() => {
    setAbierto(false);
  }, []);

  function abrir() {
    reset(valoresVacios(rango.desde));
    setAbierto(true);
  }

  function mostrar(mensaje: string, tono: TonoToast) {
    setAviso({ mensaje, tono });
  }

  async function onSubmit(datos: FormularioVenta) {
    const venta: Venta = {
      id_venta: datos.id_venta.trim(),
      fecha: datos.fecha,
      cliente: datos.cliente.trim(),
      producto: datos.producto.trim(),
      cantidad: datos.cantidad,
      importe: datos.importe,
      medio_pago: datos.medio_pago,
    };

    try {
      const alta = await crearVenta(venta);
      mostrar(alta.mensaje, alta.codigo === "VENTA_CREADA" ? "ok" : "error");
      if (alta.codigo === "VENTA_CREADA") {
        recargar();
        reset(valoresVacios(rango.desde));
        cerrar();
      }
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        mostrar(error.message, "error");
      } else {
        mostrar(error instanceof Error ? error.message : "No se pudo enviar la venta", "error");
      }
    }
  }

  return (
    <>
      <Button variant="primary" className="hidden sm:inline-flex" onClick={abrir}>
        Agregar venta
      </Button>
      {abierto ? null : (
        <button
          type="button"
          onClick={abrir}
          aria-label="Agregar venta"
          className="fixed bottom-5 right-5 z-20 grid h-14 w-14 place-items-center rounded-full bg-brand text-3xl font-light leading-none text-white shadow-lg shadow-brand/40 sm:hidden"
        >
          +
        </button>
      )}
      <Modal abierto={abierto} titulo="Agregar venta" onCerrar={cerrar}>
        <p className="mb-4 text-sm text-zinc-500">Alta individual. El id lo carga el dueño.</p>
        <form className="grid grid-cols-1 gap-3 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            label="Id venta"
            autoFocus
            error={errors.id_venta?.message}
            {...register("id_venta")}
          />
          <Input
            label="Fecha"
            type="date"
            error={errors.fecha?.message}
            {...register("fecha")}
          />
          <Input
            label="Cliente"
            error={errors.cliente?.message}
            {...register("cliente")}
          />
          <Input
            label="Producto"
            error={errors.producto?.message}
            {...register("producto")}
          />
          <Input
            label="Cantidad"
            type="number"
            min={1}
            step={1}
            error={errors.cantidad?.message}
            {...register("cantidad", { valueAsNumber: true })}
          />
          <Input
            label="Importe"
            type="number"
            min={0}
            step="0.01"
            error={errors.importe?.message}
            {...register("importe", { valueAsNumber: true })}
          />
          <Select
            label="Medio de pago"
            error={errors.medio_pago?.message}
            {...register("medio_pago")}
          >
            {MEDIOS.map((medio) => (
              <option key={medio} value={medio}>
                {medio}
              </option>
            ))}
          </Select>
          <div className="flex items-end justify-end gap-2 sm:col-span-2">
            <Button type="button" onClick={cerrar}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Guardando…" : "Guardar venta"}
            </Button>
          </div>
        </form>
      </Modal>
      {aviso ? (
        <Toast mensaje={aviso.mensaje} tono={aviso.tono} onCerrar={() => setAviso(undefined)} />
      ) : null}
    </>
  );
}
