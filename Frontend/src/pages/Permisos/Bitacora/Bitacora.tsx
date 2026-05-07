import React from 'react';
import { Search, Download, Filter, List, TrendingUp, AlertTriangle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from "../../../components/Sidebar/Sidebar";
import './Bitacora.css';

const Bitacora: React.FC = () => {
  const logs = [
    { id: 1, fecha: '20 Oct 2023', hora: '14:22:15', usuario: 'Admin Principal', init: 'AP', mod: 'Citas', color: '#003DA5' },
    { id: 2, fecha: '20 Oct 2023', hora: '14:18:02', usuario: 'Coord. Académica', init: 'CA', mod: 'Sistema', color: '#4A4A4A' },
    { id: 3, fecha: '20 Oct 2023', hora: '13:55:10', usuario: 'Admin Principal', init: 'AP', mod: 'Usuarios', color: '#D6A600' },
    { id: 4, fecha: '20 Oct 2023', hora: '12:40:00', usuario: 'Soporte Técnico', init: 'ST', mod: 'Permisos', color: '#EF4444' },
    { id: 5, fecha: '20 Oct 2023', hora: '10:15:33', usuario: 'Admin Principal', init: 'AP', mod: 'Citas', color: '#003DA5' },
  ];

  return (
    <div className="bitacora-layout">
      <Sidebar />
      
      <main className="bitacora-main">
        <header className="bitacora-topbar">
          <span className="bitacora-breadcrumb">Configuración › Bitácora</span>
          <div className="bitacora-topbar-right">
            <span className="bitacora-topbar-bell">🔔</span>
            <div className="bitacora-topbar-user">
              <div>
                <p className="bitacora-topbar-name">Admin Usuario</p>
                <p className="bitacora-topbar-role">COORDINADOR</p>
              </div>
              <div className="bitacora-topbar-avatar">AU</div>
            </div>
          </div>
        </header>

        <div className="bitacora-content">
          <div className="bitacora-header">
            <div className="brand-group">
              <h1>BITÁCORA</h1>
              <p>AUDITORÍA DE ACTIVIDAD</p>
            </div>
            <div className="search-bar">
              <Search size={18} color="#A0AEC0" />
              <input type="text" placeholder="Buscar en registros..." />
            </div>
          </div>

          <div className="btn-row">
            <button className="gold-btn"><Download size={16} /> Exportar Bitácora</button>
          </div>

          <section className="filter-section">
            <div className="f-box"><label>RANGO DE FECHAS</label><input type="text" placeholder="mm/dd/yyyy — mm/dd/yyyy" /></div>
            <div className="f-box"><label>USUARIO</label><select><option>Todos los usuarios</option></select></div>
            <div className="f-box"><label>MÓDULO</label><select><option>Todos los módulos</option></select></div>
            <button className="apply-btn"><Filter size={16} /> Aplicar Filtros</button>
          </section>

          <section className="stats-row">
            <div className="card-stat">
              <div className="circle-icon b-blue"><List size={22} /></div>
              <div className="c-text"><span>TOTAL REGISTROS</span><strong>12,482</strong></div>
            </div>
            <div className="card-stat">
              <div className="circle-icon b-green"><TrendingUp size={22} /></div>
              <div className="c-text"><span>HOY</span><strong>145</strong></div>
            </div>
            <div className="card-stat">
              <div className="circle-icon b-yellow"><AlertTriangle size={22} /></div>
              <div className="c-text"><span>ALERTAS</span><strong>0</strong></div>
            </div>
            <div className="card-stat dark-mode">
              <div className="c-text"><span className="faded">ÚLTIMO ACCESO</span><strong className="white">Hace 2 min</strong></div>
              <Clock className="watermark-icon" size={45} />
            </div>
          </section>

          <section className="table-area">
            <table className="log-table">
              <thead>
                <tr>
                  <th>FECHA Y HORA</th>
                  <th>USUARIO</th>
                  <th>MÓDULO</th>
                  <th>DETALLES</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id}>
                    <td><div className="navy bold">{log.fecha}</div><div className="muted small">{log.hora} hrs</div></td>
                    <td>
                      <div className="u-flex">
                        <div className="avatar-mini" style={{backgroundColor: `${log.color}15`, color: log.color}}>{log.init}</div>
                        <span className="navy bold">{log.usuario}</span>
                      </div>
                    </td>
                    <td className="navy">{log.mod}</td>
                    <td className="gray-txt">Nueva actividad registrada en el sistema conforme al protocolo...</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <span className="muted bold small">MOSTRANDO 1 A 5 DE 12,482 ENTRADAS</span>
              <div className="page-btns">
                <button className="arr-btn"><ChevronLeft size={16} /></button>
                <button className="n-btn active">1</button>
                <button className="n-btn">2</button>
                <button className="n-btn">3</button>
                <span className="muted">...</span>
                <button className="n-btn">2497</button>
                <button className="arr-btn"><ChevronRight size={16} /></button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Bitacora;