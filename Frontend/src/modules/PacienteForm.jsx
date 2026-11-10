import { useState } from "react";
import Alert from "../components/UI/Alert";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import Modal from "../components/UI/Modal";
import Select from "../components/UI/Select";
import { mensajesPorCampo } from "../services/api";
import { pacienteService } from "../services/pacienteService";
import { GENEROS, TIPOS_DOCUMENTO } from "../utils/catalogos";
import { hoyISO } from "../utils/formatos";
import { armarPayload, validarObligatorios, valoresDesdePaciente } from "../utils/pacientes";

/**
 * Ventana para crear o editar un paciente.
 * paciente: null para crear; el objeto del paciente para editar.
 * Se monta cuando hace falta y se desmonta al cerrar, así siempre empieza con los datos correctos.
 */
export default function PacienteForm({ paciente = null, onCerrar, onGuardado }) {
  const editando = Boolean(paciente);
  const [valores, setValores] = useState(() => valoresDesdePaciente(paciente));
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [enviando, setEnviando] = useState(false);

  const cambiar = (campo) => (evento) => setValores((previos) => ({ ...previos, [campo]: evento.target.value }));

  async function alEnviar(evento) {
    evento.preventDefault();
    setErrorGeneral("");

    const faltantes = validarObligatorios(valores, paciente);
    setErrores(faltantes);
    if (Object.keys(faltantes).length > 0) return;

    const datos = armarPayload(valores, paciente);
    if (editando && Object.keys(datos).length === 0) {
      onCerrar();
      return;
    }

    setEnviando(true);
    try {
      const guardado = editando
        ? await pacienteService.actualizar(paciente.id_paciente, datos)
        : await pacienteService.crear(datos);
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
      titulo={editando ? "Editar paciente" : "Nuevo paciente"}
      onCerrar={enviando ? undefined : onCerrar}
      pie={
        <>
          <Button variante="secundario" onClick={onCerrar} disabled={enviando}>
            Cancelar
          </Button>
          <Button type="submit" form="formulario-paciente" cargando={enviando}>
            {editando ? "Guardar cambios" : "Crear paciente"}
          </Button>
        </>
      }
    >
      <form id="formulario-paciente" onSubmit={alEnviar} noValidate className="formulario-grid">
        {errorGeneral && (
          <Alert tono="error" className="campo--ancho">
            {errorGeneral}
          </Alert>
        )}

        <Select
          etiqueta="Tipo de documento"
          opciones={TIPOS_DOCUMENTO}
          marcador="Selecciona"
          value={valores.tipo_documento}
          onChange={cambiar("tipo_documento")}
          error={errores.tipo_documento}
        />
        <Input
          etiqueta="Número de documento"
          value={valores.documento}
          onChange={cambiar("documento")}
          error={errores.documento}
          ayuda="Solo letras y números, entre 5 y 20 caracteres"
          autoComplete="off"
        />
        <Input etiqueta="Nombres" value={valores.nombres} onChange={cambiar("nombres")} error={errores.nombres} />
        <Input
          etiqueta="Apellidos"
          value={valores.apellidos}
          onChange={cambiar("apellidos")}
          error={errores.apellidos}
        />
        <Input
          etiqueta="Fecha de nacimiento"
          type="date"
          max={hoyISO()}
          value={valores.fecha_nacimiento}
          onChange={cambiar("fecha_nacimiento")}
          error={errores.fecha_nacimiento}
        />
        <Select
          etiqueta="Género"
          opciones={GENEROS}
          marcador="Selecciona"
          value={valores.genero}
          onChange={cambiar("genero")}
          error={errores.genero}
        />
        <Input
          etiqueta="Teléfono"
          type="tel"
          value={valores.telefono}
          onChange={cambiar("telefono")}
          error={errores.telefono}
          ayuda="Opcional"
        />
        <Input
          etiqueta="Correo"
          type="email"
          value={valores.correo}
          onChange={cambiar("correo")}
          error={errores.correo}
          ayuda="Opcional"
        />
        <Input
          className="campo--ancho"
          etiqueta="Dirección"
          value={valores.direccion}
          onChange={cambiar("direccion")}
          error={errores.direccion}
          ayuda="Opcional"
        />
      </form>
    </Modal>
  );
}
