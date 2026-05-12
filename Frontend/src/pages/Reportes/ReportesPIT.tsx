import "./ReportesPIT.css"
import "../../components/Sidebar/Sidebar.css"
import { useState, useEffect} from "react"

interface Cita {
  materia: string
  tutor: string
  fecha: string
  hora: string
  lugar: string
  notas: string
}

const DIVISIONES: Record<string, string> = {
  "Cálculo II": "Matemáticas e Ing.",
  "Intro to Python": "Matemáticas e Ing.",
  "Literatura Mexicana": "Humanidades",
  "Derecho": "Ciencias Sociales",
  "Economía": "Ciencias Sociales",
}

const MATERIA_COLOR: Record<string, string> = {
  "Cálculo II": "#003DA5",
  "Intro to Python": "#003DA5",
  "Literatura Mexicana": "#F5A800",
  "Derecho": "#F5A800",
  "Economía": "#aaa",
}

function getDistribucion(citas: Cita[]) {
  const counts: Record<string, number> = {}
  citas.forEach(c => {
    const div = DIVISIONES[c.materia] || "Otro"
    counts[div] = (counts[div] || 0) + 1
  })
  return counts
}

function getTendencias(citas: Cita[]) {
  const counts: Record<string, number> = {}
  citas.forEach(c => {
    if (c.fecha) counts[c.fecha] = (counts[c.fecha] || 0) + 1
  })
  const sorted = Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)).slice(-10)
  return sorted
}

function getMateriaTop(citas: Cita[]) {
  const counts: Record<string, number> = {}
  citas.forEach(c => { if (c.materia) counts[c.materia] = (counts[c.materia] || 0) + 1 })
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || ["—", 0]
}

function DonutChart({ data }: { data: Record<string, number> }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0)
  if (total === 0) return <div className="rp-donut-empty">Sin datos</div>

  const colors = ["#003DA5", "#F5A800", "#ccc"]
  const entries = Object.entries(data)
  let cumulative = 0
  const radius = 54
  const cx = 70, cy = 70
  const circumference = 2 * Math.PI * radius

  return (
    <div className="rp-donut-wrap">
      <svg width="140" height="140" viewBox="0 0 140 140">
        {entries.map(([label, val], i) => {
          const pct = val / total
          const rotation = cumulative * 360 - 90
          cumulative += pct
          return (
            <circle
              key={label}
              cx={cx} cy={cy} r={radius}
              fill="none"
              stroke={colors[i % colors.length]}
              strokeWidth="18"
              strokeDasharray={`${circumference * pct} ${circumference * (1 - pct)}`}
              strokeDashoffset={0}
              transform={`rotate(${rotation} ${cx} ${cy})`}
              style={{ transition: "stroke-dasharray 0.6s ease" }}
            />
          )
        })}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="700" fill="#003DA5">
          {Math.round((Object.values(data)[0] || 0) / total * 100)}%
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill="#888">
          {(entries[0]?.[0] || "").toUpperCase().slice(0, 12)}
        </text>
      </svg>
      <div className="rp-donut-legend">
        {entries.map(([label, val], i) => (
          <div key={label} className="rp-legend-item">
            <span className="rp-legend-dot" style={{ background: colors[i % colors.length] }} />
            <span className="rp-legend-label">{label}</span>
            <span className="rp-legend-pct">{Math.round(val / total * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function BarChart({ data }: { data: [string, number][] }) {
  const max = Math.max(...data.map(d => d[1]), 1)
  return (
    <div className="rp-bar-chart">
      {data.map(([fecha, val], i) => (
        <div key={i} className="rp-bar-col">
          <div className="rp-bar-track">
            <div
              className="rp-bar-fill"
              style={{ height: `${(val / max) * 100}%` }}
            />
          </div>
          <span className="rp-bar-label">{fecha.slice(5)}</span>
        </div>
      ))}
      {data.length === 0 && <p className="rp-empty-chart">Sin datos suficientes</p>}
    </div>
  )
}

const PAGE_SIZE = 5

function ReportesPIT() {
  const [citas, setCitas] = useState<Cita[]>([])
  const [pagina, setPagina] = useState(0)

  useEffect(() => {
    const data: Cita[] = JSON.parse(localStorage.getItem("citas") || "[]")
    setCitas(data)
  }, [])

  const distribucion = getDistribucion(citas)
  const tendencias = getTendencias(citas)
  const [materiaTop, topCount] = getMateriaTop(citas)
  const totalPaginas = Math.ceil(citas.length / PAGE_SIZE)
  const citasPagina = citas.slice(pagina * PAGE_SIZE, (pagina + 1) * PAGE_SIZE)

  const handleDescargar = () => {
    const header = "Materia,Tutor,Fecha,Hora,Lugar,Notas"
    const rows = citas.map(c =>
      `"${c.materia}","${c.tutor}","${c.fecha}","${c.hora}","${c.lugar}","${c.notas}"`
    )
    const csv = [header, ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "reportes_pit.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="rp-layout">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🎓</div>
        </div>
        <div className="sidebar-user">
          <p className="sidebar-role">Administración</p>
          <p className="sidebar-school">PIT FES Acatlán</p>
        </div>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item">⊞ Escritorio</a>
          <a href="/citas" className="nav-item">📅 Citas de Tutoría</a>
          <a href="/agenda" className="nav-item">📋 Mi Agenda</a>
          <a href="/reportes" className="nav-item active">📊 Reportes PIT</a>
          <a href="#" className="nav-item">⚙ Configuración</a>
        </nav>
        <div className="sidebar-footer">
          <a href="#" className="nav-item">❓ Ayuda Técnica</a>
          <a href="/" className="nav-item nav-logout">↪ Regresar</a>
        </div>
      </aside>

      {/* Main */}
      <main className="rp-main">

        {/* Topbar */}
        <header className="gc-topbar">
          <span className="gc-breadcrumb">Panel › Reportes</span>
          <div className="gc-topbar-right">
            <span className="gc-topbar-bell">🔔</span>
            <div className="gc-topbar-user">
              <div>
                <p className="gc-topbar-name">Admin Usuario</p>
                <p className="gc-topbar-role">COORDINADOR</p>
              </div>
              <div className="gc-topbar-avatar">AU</div>
            </div>
          </div>
        </header>

        <div className="rp-content">

          {/* Header */}
          <div className="rp-header">
            <div>
              <p className="rp-label">PANEL DE CONTROL</p>
              <h1>Reportes e Historial</h1>
              <p className="rp-subtitle">Visualiza el rendimiento académico, las tendencias de asesorías y el registro histórico detallado de la FES Acatlán.</p>
            </div>
            <button className="rp-btn-excel" onClick={handleDescargar}>
              ⬇ Descargar Excel
            </button>
          </div>

          {/* KPI Cards */}
          <div className="rp-kpis">
            <div className="rp-kpi-card">
              <p className="rp-kpi-label">Total de Tutorías</p>
              <p className="rp-kpi-value">{citas.length.toLocaleString()}</p>
              <p className="rp-kpi-trend rp-green">↑ registros guardados</p>
            </div>
            <div className="rp-kpi-card">
              <p className="rp-kpi-label">Materias Distintas</p>
              <p className="rp-kpi-value">{new Set(citas.map(c => c.materia).filter(Boolean)).size}</p>
              <p className="rp-kpi-trend rp-green">↑ asignaturas activas</p>
            </div>
            <div className="rp-kpi-card rp-kpi-blue">
              <p className="rp-kpi-label-white">Materia más Solicitada</p>
              <p className="rp-kpi-value-white">{materiaTop}</p>
              <p className="rp-kpi-trend-white">⊙ {topCount as number} sesiones registradas</p>
            </div>
          </div>

          {/* Gráficas */}
          <div className="rp-graficas">
            <div className="rp-card rp-card-wide">
              <div className="rp-card-header">
                <div>
                  <h3>Tendencias de Tutorías</h3>
                  <p>Registro diario del último mes</p>
                </div>
                <span className="rp-pill">Últimos {tendencias.length} días</span>
              </div>
              <BarChart data={tendencias} />
            </div>

            <div className="rp-card">
              <div className="rp-card-header">
                <div>
                  <h3>Distribución por División</h3>
                  <p>Participación académica</p>
                </div>
              </div>
              <DonutChart data={distribucion} />
            </div>
          </div>

          {/* Historial */}
          <div className="rp-card rp-card-full">
            <div className="rp-card-header">
              <h3>Historial Detallado</h3>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="rp-icon-btn">⇅</button>
                <button className="rp-icon-btn">☰</button>
              </div>
            </div>

            <table className="rp-tabla">
              <thead>
                <tr>
                  <th>DÍA</th>
                  <th>SALÓN</th>
                  <th>TUTOR</th>
                  <th>MATERIA</th>
                  <th>NOTAS</th>
                </tr>
              </thead>
              <tbody>
                {citasPagina.length === 0 ? (
                  <tr><td colSpan={5} className="rp-empty">No hay citas registradas</td></tr>
                ) : (
                  citasPagina.map((c, i) => (
                    <tr key={i}>
                      <td>
                        <div className="rp-fecha-cell">
                          <strong>{c.fecha?.split("-")[2]}</strong>
                          <span>{new Date(c.fecha + "T00:00:00").toLocaleString("es-MX", { month: "short" })}</span>
                          <span>{c.fecha?.split("-")[0]}</span>
                        </div>
                      </td>
                      <td>{c.lugar || "—"}</td>
                      <td>
                        <div className="gc-tutor-cell">
                          <div className="gc-avatar-small">{c.tutor?.[0]}</div>
                          {c.tutor}
                        </div>
                      </td>
                      <td>
                        <span className="rp-materia-badge" style={{ background: MATERIA_COLOR[c.materia] || "#003DA5" }}>
                          {c.materia}
                        </span>
                      </td>
                      <td className="rp-notas">{c.notas || "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="rp-pagination">
              <span>Mostrando {Math.min(PAGE_SIZE, citas.length - pagina * PAGE_SIZE)} de {citas.length} registros</span>
              <div className="rp-pag-btns">
                <button
                  className="rp-pag-btn"
                  disabled={pagina === 0}
                  onClick={() => setPagina(p => p - 1)}
                >Anterior</button>
                <button
                  className="rp-pag-btn rp-pag-active"
                  disabled={pagina >= totalPaginas - 1}
                  onClick={() => setPagina(p => p + 1)}
                >Siguiente</button>
              </div>
            </div>
          </div>

          <footer className="rp-footer">
            © 2025 PIT FES ACATLÁN · SISTEMA DE GESTIÓN ACADÉMICA. TODOS LOS DERECHOS RESERVADOS.
          </footer>

        </div>
      </main>
    </div>
  )
}

export default ReportesPIT