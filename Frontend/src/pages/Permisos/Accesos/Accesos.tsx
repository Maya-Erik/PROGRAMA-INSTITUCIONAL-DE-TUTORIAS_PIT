import React from 'react';
import { Plus, Shield, CheckCircle, Info, Mail, Phone, Edit3, Trash2, ChevronLeft, ChevronRight, Filter, Download } from 'lucide-react';
import Sidebar from "../../../components/Sidebar/Sidebar";
import './Accesos.css';

const ControlAccesos: React.FC = () => {
  const usuariosPermisos = [
    { id: 1, nombre: 'Dra. Elena Ramírez', email: 'elena.ramirez@acatlan.unam.mx', rol: 'Administrador Académico', permisos: ['LECTURA', 'ESCRITURA', 'AUDITORÍA'], estado: 'Activo', avatar: 'https://i.pravatar.cc/150?u=elena' },
    { id: 2, nombre: 'Mtro. Jorge Lozano', email: 'j.lozano@acatlan.unam.mx', rol: 'Coordinador de Área', permisos: ['LECTURA', 'EDICIÓN'], estado: 'Activo', avatar: 'https://i.pravatar.cc/150?u=jorge' },
    { id: 3, nombre: 'Ing. Sofía Méndez', email: 's.mendez@acatlan.unam.mx', rol: 'Analista de Datos', permisos: ['LECTURA'], estado: 'Inactivo', avatar: '' },
  ];

  return (
    <div className="accesos-layout">
      <Sidebar />
      
      <main className="accesos-main">
        <header className="accesos-topbar">
          <span className="accesos-breadcrumb">Configuración › Accesos</span>
          <div className="accesos-topbar-right">
            <span className="accesos-topbar-bell">🔔</span>
            <div className="accesos-topbar-user">
              <div>
                <p className="accesos-topbar-name">Admin Usuario</p>
                <p className="accesos-topbar-role">COORDINADOR</p>
              </div>
              <div className="accesos-topbar-avatar">AU</div>
            </div>
          </div>
        </header>

        <div className="accesos-content">
          <div className="access-intro">
            <div className="intro-text">
              <h1>Control de Accesos</h1>
              <p>Configura y audita los privilegios de los usuarios en la plataforma PIT.</p>
            </div>
            <button className="gold-btn-access"><Plus size={20} /> Nuevo Permiso</button>
          </div>

          <section className="stats-grid">
            <div className="stat-mini-card">
              <div className="icon-blue-bg"><Shield size={22} /></div>
              <div className="stat-info"><span>Total Permisos</span><strong>124</strong></div>
            </div>
            <div className="stat-mini-card">
              <div className="icon-green-bg"><CheckCircle size={22} /></div>
              <div className="stat-info"><span>Activos</span><strong>118</strong></div>
            </div>
            <div className="stat-mini-card">
              <div className="stat-info">
                <span>Última Auditoría</span>
                <strong className="navy-text">Hace 2 horas</strong>
                <a href="#" className="audit-link">Ver Registro Completo</a>
              </div>
            </div>
          </section>

          <section className="table-container-access">
            <div className="table-header-row">
              <h3>Listado de Usuarios y Permisos</h3>
              <div className="table-tools">
                <Filter size={18} />
                <Download size={18} />
              </div>
            </div>
            <table className="access-table">
              <thead>
                <tr>
                  <th>USUARIO</th>
                  <th>ROL</th>
                  <th>PERMISOS ASIGNADOS</th>
                  <th>ESTADO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {usuariosPermisos.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div className="user-profile">
                        {u.avatar ? <img src={u.avatar} alt="avatar" /> : <div className="avatar-placeholder"><Shield size={16}/></div>}
                        <div className="user-details">
                          <span className="name">{u.nombre}</span>
                          <span className="email">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="role-text-cell">{u.rol}</td>
                    <td>
                      <div className="perms-list">
                        {u.permisos.map((p, i) => (
                          <span key={i} className={`perm-tag ${p.toLowerCase()}`}>{p}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className={`status-dot-text ${u.estado.toLowerCase()}`}>
                        <span className="dot"></span> {u.estado}
                      </span>
                    </td>
                    <td>
                      <div className="action-icons">
                        <Edit3 size={18} />
                        <Trash2 size={18} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="table-pagination">
              <span className="count-text">MOSTRANDO 3 DE 124 USUARIOS</span>
              <div className="pg-controls">
                <button className="pg-arr"><ChevronLeft size={16} /></button>
                <button className="pg-num active">1</button>
                <button className="pg-num">2</button>
                <button className="pg-num">3</button>
                <button className="pg-arr"><ChevronRight size={16} /></button>
              </div>
            </div>
          </section>

          <section className="bottom-info-grid">
            <div className="info-card-blue">
              <h3>Seguridad Institucional</h3>
              <p>El sistema de permisos se rige bajo la normativa de protección de datos de la UNAM. Asegúrese de otorgar privilegios mínimos necesarios para cada perfil.</p>
              <a href="#">Consultar lineamientos →</a>
            </div>
            <div className="info-card-white">
              <div className="support-header">
                <div className="support-title">
                  <Info size={20} className="info-icon" />
                  <h3>Soporte Técnico</h3>
                </div>
                <div className="help-circle">?</div>
              </div>
              <p>¿Necesitas ayuda para configurar permisos avanzados o roles personalizados?</p>
              <div className="contact-item"><Mail size={16} /> sistemas.pit@acatlan.unam.mx</div>
              <div className="contact-item"><Phone size={16} /> Ext. 45201 / 45205</div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ControlAccesos;