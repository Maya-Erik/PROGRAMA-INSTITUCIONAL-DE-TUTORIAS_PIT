import React from 'react';
import { Plus, Filter, Download, Edit3, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from "../../../components/Sidebar/Sidebar";
import './Usuarios.css';

const Usuarios: React.FC = () => {
  const usuarios = [
    { id: 1, nombre: 'Beatriz Elena Morales', email: 'b.morales@acatlan.unam.mx', rol: 'Administrador', division: 'Ciencias Exactas', estado: 'Activo', colorRol: '#003DA5', avatar: 'https://i.pravatar.cc/150?u=beatriz' },
    { id: 2, nombre: 'Jorge Ramírez Silva', email: 'jorge.ramirez@acatlan.unam.mx', rol: 'Tutor', division: 'Socioeconómicas', estado: 'Activo', colorRol: '#D6A600', avatar: 'https://i.pravatar.cc/150?u=jorge' },
    { id: 3, nombre: 'Claudia Ruiz Gómez', email: 'cruiz042@comunidad.unam.mx', rol: 'Alumno', division: 'Derecho', estado: 'Inactivo', colorRol: '#A0AEC0', avatar: 'https://i.pravatar.cc/150?u=claudia' },
    { id: 4, nombre: 'Marcos Herrera', email: 'm.herrera@acatlan.unam.mx', rol: 'Tutor', division: 'Humanidades y Artes', estado: 'Activo', colorRol: '#D6A600', avatar: 'https://i.pravatar.cc/150?u=marcos' },
  ];

  return (
    <div className="usuarios-layout">
      <Sidebar />
      
      <main className="usuarios-main">
        <header className="usuarios-topbar">
          <span className="usuarios-breadcrumb">Configuración › Usuarios</span>
          <div className="usuarios-topbar-right">
            <span className="usuarios-topbar-bell">🔔</span>
            <div className="usuarios-topbar-user">
              <div>
                <p className="usuarios-topbar-name">Admin Usuario</p>
                <p className="usuarios-topbar-role">COORDINADOR</p>
              </div>
              <div className="usuarios-topbar-avatar">AU</div>
            </div>
          </div>
        </header>

        <div className="usuarios-content">
          <div className="top-actions">
            <div className="left-group">
              <button className="white-btn"><Filter size={16} /> Filtros</button>
              <button className="white-btn"><Download size={16} /> Exportar</button>
            </div>
            <button className="gold-btn-user">
              <Plus size={20} /> Nuevo Usuario
            </button>
          </div>

          <div className="table-card-users">
            <table className="user-table">
              <thead>
                <tr>
                  <th>USUARIO</th>
                  <th>ROL</th>
                  <th>DIVISIÓN</th>
                  <th>ESTADO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="user-cell">
                        <img src={u.avatar} alt="avatar" className="u-avatar-img" />
                        <div className="u-info">
                          <span className="u-name">{u.nombre}</span>
                          <span className="u-mail">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="role-cell">
                        <span className="dot-role" style={{ backgroundColor: u.colorRol }}></span>
                        {u.rol}
                      </div>
                    </td>
                    <td className="div-text">{u.division}</td>
                    <td>
                      <span className={`status-pill ${u.estado.toLowerCase()}`}>
                        {u.estado}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="icon-action"><Edit3 size={18} /></button>
                        <button className="icon-action"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <footer className="table-footer">
              <span className="total-count">Mostrando 1-4 de 2,482 usuarios</span>
              <div className="pagination-ctrl">
                <button className="pg-arrow"><ChevronLeft size={16} /></button>
                <button className="pg-btn active">1</button>
                <button className="pg-btn">2</button>
                <button className="pg-btn">3</button>
                <button className="pg-arrow"><ChevronRight size={16} /></button>
              </div>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Usuarios;