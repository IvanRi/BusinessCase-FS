import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { crearVenta } from "../../api/ventas";
import { ApiError } from "../../api/client";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Loader } from "../../components/Loader";
import { Select } from "../../components/Select";
import { useVentas } from "../../context/VentasContext";
import { esquemaVenta, type FormularioVenta as CamposVenta } from "../../helpers/ventaSchema";
import type { AvisoCarga, MedioPago, Venta } from "../../tipos";

const MEDIOS: MedioPago[] = ["efectivo", "tarjeta", "transferencia"];

function valoresVacios(fecha: string): CamposVenta {
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

interface FormularioVentaProps {
  onListo: (aviso: AvisoCarga, recargar: boolean) => void;
  onCancelar: () => void;
}

export function FormularioVenta({ onListo, onCancelar }: FormularioVentaProps) {
  const { rango } = useVentas();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CamposVenta>({
    resolver: yupResolver(esquemaVenta),
    defaultValues: valoresVacios(rango.desde),
  });

  async function onSubmit(datos: CamposVenta) {
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
      onListo(
        { mensaje: alta.mensaje, tono: alta.codigo === "VENTA_CREADA" ? "ok" : "error" },
        alta.codigo === "VENTA_CREADA",
      );
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        onListo({ mensaje: error.message, tono: "error" }, false);
      } else {
        onListo(
          { mensaje: error instanceof Error ? error.message : "No se pudo enviar la venta", tono: "error" },
          false,
        );
      }
    }
  }

  return (
    <div className="relative">
      {isSubmitting ? <Loader overlay label="Guardando…" /> : null}
    <form className="grid grid-cols-1 gap-3 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input label="Id venta" error={errors.id_venta?.message} {...register("id_venta")} />
      <Input label="Fecha" type="date" error={errors.fecha?.message} {...register("fecha")} />
      <Input label="Cliente" error={errors.cliente?.message} {...register("cliente")} />
      <Input label="Producto" error={errors.producto?.message} {...register("producto")} />
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
      <Select label="Medio de pago" error={errors.medio_pago?.message} {...register("medio_pago")}>
        {MEDIOS.map((medio) => (
          <option key={medio} value={medio}>
            {medio}
          </option>
        ))}
      </Select>
      <div className="flex items-end justify-end gap-2 sm:col-span-2">
        <Button type="button" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Guardando…" : "Guardar venta"}
        </Button>
      </div>
    </form>
    </div>
  );
}
