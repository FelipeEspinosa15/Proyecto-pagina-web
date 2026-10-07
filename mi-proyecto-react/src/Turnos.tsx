import { useState } from "react";
import "./Turnos.css";

type Prioridad = "alta" | "media" | "baja";
type Estado = "pendiente" | "en_atencion" | "completado";

type Turno = {
  id: string;
  nombre: string;
  motivo: string;
  prioridad: Prioridad;
  estado: Estado;
  hora: string;
};

const turnosIniciales: Turno[] = [
  {
    id: "t-1",
    nombre: "Lina",
    motivo: "Pregunta sobre React",
    prioridad: "alta",
    estado: "pendiente",
    hora: "09:00",
  },
  {
    id: "t-2",
    nombre: "Tomás",
    motivo: "Error de instalación",
    prioridad: "media",
    estado: "en_atencion",
    hora: "09:30",
  },
  {
    id: "t-3",
    nombre: "María",
    motivo: "Consulta general",
    prioridad: "baja",
    estado: "completado",
    hora: "10:00",
  },
];

const coloresPrioridad: Record<Prioridad, string> = {
  alta: "#f44336",
  media: "#ff9800",
  baja: "#4caf50",
};

const etiquetasEstado: Record<Estado, string> = {
  pendiente: "Pendiente",
  en_atencion: "En atención",
  completado: "Completado",
};

export default function Turnos() {
  const [turnos, setTurnos] = useState<Turno[]>(turnosIniciales);
  const [nombre, setNombre] = useState("");
  const [motivo, setMotivo] = useState("");
  const [prioridad, setPrioridad] = useState<Prioridad>("media");
  const [filtroEstado, setFiltroEstado] = useState<Estado | "todos">("todos");

  const agregarTurno = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !motivo.trim()) return;
    const nuevo: Turno = {
      id: `t-${Date.now()}`,
      nombre: nombre.trim(),
      motivo: motivo.trim(),
      prioridad,
      estado: "pendiente",
      hora: new Date().toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setTurnos([...turnos, nuevo]);
    setNombre("");
    setMotivo("");
    setPrioridad("media");
  };

  const cambiarEstado = (id: string) => {
    setTurnos(
      turnos.map((t) => {
        if (t.id !== id) return t;
        const siguiente: Record<Estado, Estado> = {
          pendiente: "en_atencion",
          en_atencion: "completado",
          completado: "pendiente",
        };
        return { ...t, estado: siguiente[t.estado] };
      })
    );
  };

  const eliminarTurno = (id: string) => {
    setTurnos(turnos.filter((t) => t.id !== id));
  };

  const turnosFiltrados =
    filtroEstado === "todos"
      ? turnos
      : turnos.filter((t) => t.estado === filtroEstado);

  const conteo = {
    pendiente: turnos.filter((t) => t.estado === "pendiente").length,
    en_atencion: turnos.filter((t) => t.estado === "en_atencion").length,
    completado: turnos.filter((t) => t.estado === "completado").length,
  };

  return (
    <section>
      <h2>Sistema de Turnos</h2>

      <div className="stats">
        <div className="stat pendiente">
          <span className="numero">{conteo.pendiente}</span>
          <span className="label">Pendientes</span>
        </div>
        <div className="stat en_atencion">
          <span className="numero">{conteo.en_atencion}</span>
          <span className="label">En atención</span>
        </div>
        <div className="stat completado">
          <span className="numero">{conteo.completado}</span>
          <span className="label">Completados</span>
        </div>
      </div>

      <div className="filtros">
        <button
          className={filtroEstado === "todos" ? "activo" : ""}
          onClick={() => setFiltroEstado("todos")}
        >
          Todos
        </button>
        <button
          className={filtroEstado === "pendiente" ? "activo" : ""}
          onClick={() => setFiltroEstado("pendiente")}
        >
          Pendientes
        </button>
        <button
          className={filtroEstado === "en_atencion" ? "activo" : ""}
          onClick={() => setFiltroEstado("en_atencion")}
        >
          En atención
        </button>
        <button
          className={filtroEstado === "completado" ? "activo" : ""}
          onClick={() => setFiltroEstado("completado")}
        >
          Completados
        </button>
      </div>

      <ul className="lista-turnos">
        {turnosFiltrados.length === 0 && (
          <li className="sin-resultados">No hay turnos en esta categoría</li>
        )}
        {turnosFiltrados.map((t) => (
          <li key={t.id} className={`turno estado-${t.estado}`}>
            <div className="turno-header">
              <span className="hora">{t.hora}</span>
              <span
                className="prioridad"
                style={{ backgroundColor: coloresPrioridad[t.prioridad] }}
              >
                {t.prioridad}
              </span>
            </div>
            <div className="info-turno">
              <strong>{t.nombre}</strong>
              <span className="motivo">{t.motivo}</span>
            </div>
            <div className="acciones">
              <button
                onClick={() => cambiarEstado(t.id)}
                className={`btn-estado btn-${t.estado}`}
              >
                {etiquetasEstado[t.estado]} →
              </button>
              <button
                onClick={() => eliminarTurno(t.id)}
                className="btn-eliminar"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={agregarTurno} className="formulario">
        <h3>Nuevo turno</h3>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Motivo"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        />
        <select
          value={prioridad}
          onChange={(e) => setPrioridad(e.target.value as Prioridad)}
        >
          <option value="alta">Prioridad Alta</option>
          <option value="media">Prioridad Media</option>
          <option value="baja">Prioridad Baja</option>
        </select>
        <button type="submit">Agregar turno</button>
      </form>
    </section>
  );
}
