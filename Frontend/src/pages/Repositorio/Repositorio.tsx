import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { obtenerMaterialesPorCategoria, obtenerMaterialesPorCarrera, obtenerCategorias } from '../../services/api';
import './Repositorio.css';

interface Material {
    id_material: number;
    titulo: string;
    descripcion: string;
    tipo: string;
    archivo_url: string;
    tamano: string;
}

const Repositorio = () => {
    const navigate = useNavigate();
    const [seccionActiva, setSeccionActiva] = useState('documentos');
    const [materialesDoc, setMaterialesDoc] = useState<Material[]>([]);
    const [materialesFormacion, setMaterialesFormacion] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);

    const carreras = [
        "Actuaria", "Arquitectura", "Ciencias Politicas y Administracion Publica",
        "Comunicacion", "Derecho", "Diseño Grafico", "Economia",
        "Enseñanza de (Español) (Inglés) Como Lengua Extranjera", "Enseñanza de Ingles",
        "Filosofia", "Historia", "Ingenieria Civil", "Lengua y Literaturas Hispanicas",
        "Matematicas Aplicadas y Computacion", "Pedagogia", "Relaciones Internacionales",
        "Sociologia", "Derecho (SUAyED)", "Relaciones Internacionales (SUAyED)", "LICEL"
    ];

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setLoading(true);
        const [docRes, formacionRes] = await Promise.all([
            obtenerMaterialesPorCategoria('documentos_institucionales'),
            obtenerMaterialesPorCategoria('recursos_formacion')
        ]);
        
        if (docRes.success) setMaterialesDoc(docRes.materiales || []);
        if (formacionRes.success) setMaterialesFormacion(formacionRes.materiales || []);
        
        setLoading(false);
    };

    const handleCarreraClick = (carrera: string) => {
        navigate(`/repositorio/${encodeURIComponent(carrera)}`);
    };

    return (
        <div className="repositorio-page">
            <Navbar />
            
            <section className="repositorio-section">
                <div className="repositorio-container">
                    <h1 className="repositorio-titulo">Repositorio Academico</h1>
                    <p className="repositorio-subtitulo">
                        Accede a documentos institucionales, materiales academicos y recursos de formacion
                    </p>

                    <div className="repositorio-tabs">
                        <button 
                            className={`repositorio-tab ${seccionActiva === 'documentos' ? 'activo' : ''}`}
                            onClick={() => setSeccionActiva('documentos')}
                        >
                            Documentos Institucionales
                        </button>
                        <button 
                            className={`repositorio-tab ${seccionActiva === 'materiales' ? 'activo' : ''}`}
                            onClick={() => setSeccionActiva('materiales')}
                        >
                            Materiales Academicos
                        </button>
                        <button 
                            className={`repositorio-tab ${seccionActiva === 'formacion' ? 'activo' : ''}`}
                            onClick={() => setSeccionActiva('formacion')}
                        >
                            Recursos de Formacion
                        </button>
                    </div>

                    {seccionActiva === 'documentos' && (
                        <div className="repositorio-seccion">
                            <h2 className="seccion-titulo">Documentos Institucionales</h2>
                            <p className="seccion-descripcion">
                                Documentos oficiales, reglamentos y formatos del Programa Institucional de Tutorias
                            </p>
                            {loading ? (
                                <div className="loading-text">Cargando documentos...</div>
                            ) : materialesDoc.length === 0 ? (
                                <div className="empty-text">No hay documentos disponibles</div>
                            ) : (
                                <div className="repositorio-grid">
                                    {materialesDoc.map((doc) => (
                                        <div key={doc.id_material} className="repositorio-card">
                                            <div className="card-icon">📄</div>
                                            <div className="card-content">
                                                <h3 className="card-titulo">{doc.titulo}</h3>
                                                {doc.descripcion && <p className="card-descripcion">{doc.descripcion}</p>}
                                                <div className="card-meta">
                                                    <span className="card-tipo">{doc.tipo}</span>
                                                    {doc.tamano && <span className="card-tamanio">{doc.tamano}</span>}
                                                </div>
                                                <a href={doc.archivo_url} target="_blank" rel="noopener noreferrer" className="card-btn">
                                                    Ver documento
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {seccionActiva === 'materiales' && (
                        <div className="repositorio-seccion">
                            <h2 className="seccion-titulo">Materiales Academicos por Carrera</h2>
                            <p className="seccion-descripcion">
                                Selecciona tu carrera para acceder a materiales academicos especificos
                            </p>
                            <div className="carreras-grid">
                                {carreras.map((carrera, index) => (
                                    <div key={index} className="carrera-card" onClick={() => handleCarreraClick(carrera)}>
                                        <div className="carrera-icon">📚</div>
                                        <h3 className="carrera-nombre">{carrera}</h3>
                                        <p className="carrera-descripcion">Ver materiales academicos</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {seccionActiva === 'formacion' && (
                        <div className="repositorio-seccion">
                            <h2 className="seccion-titulo">Recursos de Formacion</h2>
                            <p className="seccion-descripcion">
                                Cursos, talleres y guias para la formacion continua de tutores y estudiantes
                            </p>
                            {loading ? (
                                <div className="loading-text">Cargando recursos...</div>
                            ) : materialesFormacion.length === 0 ? (
                                <div className="empty-text">No hay recursos disponibles</div>
                            ) : (
                                <div className="repositorio-grid">
                                    {materialesFormacion.map((recurso) => (
                                        <div key={recurso.id_material} className="repositorio-card">
                                            <div className="card-icon">🎓</div>
                                            <div className="card-content">
                                                <h3 className="card-titulo">{recurso.titulo}</h3>
                                                {recurso.descripcion && <p className="card-descripcion">{recurso.descripcion}</p>}
                                                <div className="card-meta">
                                                    <span className="card-tipo">{recurso.tipo}</span>
                                                    {recurso.tamano && <span className="card-tamanio">{recurso.tamano}</span>}
                                                </div>
                                                <a href={recurso.archivo_url} target="_blank" rel="noopener noreferrer" className="card-btn">
                                                    Ver recurso
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Repositorio;