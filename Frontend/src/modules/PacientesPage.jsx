import { useCallback, useEffect, useMemo, useState } from "react";
import Alert from "../components/UI/Alert";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import Modal from "../components/UI/Modal";
import Table from "../components/UI/Table";
import { EstadoBadge } from "../components/UI/Badge";
import { useAuth } from "../hooks/useAuth";
import { pacienteService } from "../services/pacienteService";
import { GENEROS, etiquetaDe } from "../utils/catalogos";
import { calcularEdad, formatearFecha, normalizarTexto } from "../utils/formatos";
import { ROLES } from "../utils/modulos";
import PacienteForm from "./PacienteForm";

export default function PacientesPage() {
  const { usuario } = useAuth();
  const puedeCambiarEstado = usuario.rol === ROLES.ADMINISTRADOR;

  const [pacientes, setPacientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [aviso, setAviso] = useState("");

  // formulario: undefined = cerrado, null = nuevo paciente, objeto = editar ese paciente
  const [formulario, setFormulario] = useState(undefined);
  const [porCambiar, setPorCambiar] = useState(null);
  const [cambiando, setCambiando] = useState(false);
  const [errorEstado, setErrorEstado] = useState("");

  const cargar = useCallback(async () => {
    try {
      setPacientes(await pacienteService.listar());
      setErrorCarga("");
    } catch (fallo) {
      setErrorCarga(fallo.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const visibles = useMemo(() => {
    const texto = normalizarTexto(busqueda).trim();
    if (!texto) return pacientes;
    return pacientes.filter((p) =>
      normalizarTexto(`${p.documento} ${p.nombres} ${p.apellidos}`).includes(texto)
    );
  }, [pacientes, busqueda]);

  async function alGuardar(paciente, accion) {
    setFormulario(undefined);
    setAviso(`Paciente ${accion}: ${paciente.nombres} ${paciente.apellidos}.`);
    await cargar();
  }

  async function confirmarCambioEstado() {
    setCambiando(true);
    setErrorEstado("");
    try {
      const nuevoEstado = !porCambiar.estado;
      await pacienteService.cambiarEstado(porCambiar.id_paciente, nuevoEstado);
      setAviso(`${porCambiar.nombres} ${porCambiar.apellidos} ahora está ${nuevoEstado ? "activo" : "inactivo"}.`);
      setPorCambiar(null);
      await cargar();
    } catch (fallo) {
      setErrorEstado(fallo.message);
    } finally {
      setCambiando(false);
    }
  }

  const columnas = [
    { clave: "documento", titulo: "Documento", render: (p) => `${p.tipo_documento} ${p.documento}` },
    { clave: "nombre", titulo: "Paciente", render: (p) => `${p.nombres} ${p.apellidos}` },
    {
      clave: "fecha_nacimiento",
      titulo: "Nacimiento",
      render: (p) => `${formatearFecha(p.fecha_nacimiento)} (${calcularEdad(p.fecha_nacimiento)} años)`,
    },
    { clave: "genero", titulo: "Género", render: (p) => etiquetaDe(GENEROS, p.genero) },
    { clave: "telefono", titulo: "Teléfono", render: (p) => p.telefono ?? "—" },
    { clave: "estado", titulo: "Estado", render: (p) => <EstadoBadge estado={p.estado} /> },
    {
      clave: "acciones",
      titulo: "Acciones",
      alinear: "derecha",
      render: (p) => (
        <span className="acciones-fila">
          <Button variante="secundario" tamano="sm" onClick={() => setFormulario(p)}>
            Editar
          </Button>
          {puedeCambiarEstado && (
            <Button
              variante="texto"
              tamano="sm"
              onClick={() => {
                setErrorEstado("");
                setPorCambiar(p);
              }}
            >
              {p.estado ? "Desactivar" : "Activar"}
            </Button>
          )}
        </span>
      ),
    },
  ];

  return (
    <div className="pagina">
      <div className="pagina__cabecera">
        <h1>Pacientes</h1>
        <Button
          onClick={() => {
            setAviso("");
            setFormulario(null);
          }}
        >
          Nuevo paciente
        </Button>
      </div>

      {aviso && <Alert tono="exito">{aviso}</Alert>}
      {errorCarga && (
        <Alert tono="error" titulo="No se pudo cargar la lista de pacientes">
          {errorCarga}
        </Alert>
      )}

      <div className="herramientas">
        <Input
          className="herramientas__buscador"
          etiqueta="Buscar paciente"
          type="search"
          placeholder="Documento, nombre o apellido"
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
        />
        {!cargando && (
          <p className="herramientas__conteo">
            {visibles.length} de {pacientes.length} pacientes
          </p>
        )}
      </div>

      <Table
        descripcion="Lista de pacientes"
        columnas={columnas}
        filas={visibles}
        claveFila="id_paciente"
        cargando={cargando}
        vacio={
          busqueda
            ? "Ningún paciente coincide con la búsqueda."
            : "Todavía no hay pacientes. Pulsa «Nuevo paciente» para registrar el primero."
        }
      />

      {formulario !== undefined && (
        <PacienteForm
          key={formulario?.id_paciente ?? "nuevo"}
          paciente={formulario}
          onCerrar={() => setFormulario(undefined)}
          onGuardado={alGuardar}
        />
      )}

      <Modal
        abierto={Boolean(porCambiar)}
        ancho="sm"
        titulo={porCambiar?.estado ? "Desactivar paciente" : "Activar paciente"}
        onCerrar={cambiando ? undefined : () => setPorCambiar(null)}
        pie={
          <>
            <Button variante="secundario" onClick={() => setPorCambiar(null)} disabled={cambiando}>
              Cancelar
            </Button>
            <Button
              variante={porCambiar?.estado ? "peligro" : "primario"}
              cargando={cambiando}
              onClick={confirmarCambioEstado}
            >
              {porCambiar?.estado ? "Desactivar" : "Activar"}
            </Button>
          </>
        }
      >
        {errorEstado && <Alert tono="error">{errorEstado}</Alert>}
        <p>
          {porCambiar?.estado
            ? `No se podrán crear órdenes médicas nuevas para ${porCambiar?.nombres} ${porCambiar?.apellidos}.`
            : `${porCambiar?.nombres} ${porCambiar?.apellidos} volverá a estar disponible para órdenes médicas.`}
        </p>
      </Modal>
    </div>
  );
}
