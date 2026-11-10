import { useState } from "react";
import Alert from "../components/UI/Alert";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import Modal from "../components/UI/Modal";
import { mensajesPorCampo } from "../services/api";
import { medicamentoService } from "../services/medicamentoService";
import { armarPayload, validarObligatorios, valoresDesdeMedicamento } from "../utils/medicamentos";

/**
 * Ventana para crear o editar un medicamento.
 * medicamento: null para crear; el objeto del medicamento para editar.
 */
export default function MedicamentoForm({ medicamento = null, onCerrar, onGuardado }) {
  const editando = Boolean(medicamento);
  const [valores, setValores] = useState(() => valoresDesdeMedicamento(medicamento));
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [enviando, setEnviando] = useState(false);

  const cambiar = (campo) => (evento) => {
    const target = evento.target;
    const valor = target.type === "checkbox" ? target.checked : target.value;
    setValores((previos) => ({ ...previos, [campo]: valor }));
  };

  async function alEnviar(evento) {
    evento.preventDefault();
    setErrorGeneral("");

    const faltantes = validarObligatorios(valores, medicamento);
    setErrores(faltantes);
    if (Object.keys(faltantes).length > 0) return;

    const datos = armarPayload(valores, medicamento);
    if (editando && Object.keys(datos).length === 0) {
      onCerrar();
      return;
    }

    setEnviando(true);
    try {
      const guardado = editando
        ? await medicamentoService.actualizar(medicamento.id_medicamento, datos)
        : await medicamentoService.crear(datos);
      onGuardado(guardado, editando ? "actualizado" : "creado");
    } catch (fallo) {
      setErrores(mensajesPorCampo(fallo));
      setErrorGeneral(fallo.message);
      setEnviando(false);
    }
  }

  return (
    <Modal
      abierto
      ancho="lg"
      titulo={editando ? "Editar medicamento" : "Nuevo medicamento"}
      onCerrar={enviando ? undefined : onCerrar}
      pie={
        <>
          <Button variante="secundario" onClick={onCerrar} disabled={enviando}>
            Cancelar
          </Button>
          <Button type="submit" form="formulario-medicamento" cargando={enviando}>
            {editando ? "Guardar cambios" : "Crear medicamento"}
          </Button>
        </>
      }
    >
      <form id="formulario-medicamento" onSubmit={alEnviar} noValidate className="formulario-grid">
        {errorGeneral && (
          <Alert tono="error" className="campo--ancho">
            {errorGeneral}
          </Alert>
        )}

        <Input
          etiqueta="Código CUMS"
          value={valores.codigo_cums}
          onChange={cambiar("codigo_cums")}
          error={errores.codigo_cums}
          ayuda="Código único de medicamentos"
          autoComplete="off"
        />

        <Input
          etiqueta="Tipo de medicamento"
          value={valores.tipo_medicamento}
          onChange={cambiar("tipo_medicamento")}
          error={errores.tipo_medicamento}
          ayuda="Ejemplo: Analgésico, Antibiótico..."
        />

        <Input
          etiqueta="Nombre genérico"
          value={valores.nombre_generico}
          onChange={cambiar("nombre_generico")}
          error={errores.nombre_generico}
        />

        <Input
          etiqueta="Nombre comercial"
          value={valores.nombre_comercial}
          onChange={cambiar("nombre_comercial")}
          error={errores.nombre_comercial}
        />

        <Input
          etiqueta="Stock mínimo"
          type="number"
          min="0"
          value={valores.stock_minimo}
          onChange={cambiar("stock_minimo")}
          error={errores.stock_minimo}
          ayuda="Umbral para alerta de inventario"
        />

        <div className="campo--ancho flex items-center space-x-6 pt-2">
          <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={valores.es_controlado}
              onChange={cambiar("es_controlado")}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span>¿Es medicamento controlado?</span>
          </label>

          <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={valores.estado}
              onChange={cambiar("estado")}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span>Activo</span>
          </label>
        </div>
      </form>
    </Modal>
  );
}