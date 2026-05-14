import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { obtenerMaterialesPorCarrera } from '../../services/api';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './RepositorioCarrera.css';

interface Material {
    id_material: number;
    titulo: string;
    descripcion: string;
    archivo_url: string;
    tamaño: string;
}

const RepositorioCarrera: React.FC = () => {
    const { carrera } = useParams<{ carrera: string }>();
    const [materiales, setMateriales] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);
    const carreraDecodificada = decodeURIComponent(carrera || '');

    useEffect(() => {
        const cargarMateriales = async () => {
            setLoading(true);
            const data = await obtenerMaterialesPorCarrera(carreraDecodificada);
            if (data.success) {
                setMateriales(data.materiales || []);
            }
            setLoading(false);
        };
        cargarMateriales();
    }, [carreraDecodificada]);

    return (
        <div className="repo-carrera-page">
            <Navbar />
            
            <section className="repo-carrera-section">
                <div className="repo-carrera-container">
                    <Link to="/repositorio" className="repo-carrera-back">
                        <ArrowBackIcon fontSize="small" /> Volver al Repositorio
                    </Link>
                    
                    <h1 className="repo-carrera-título">Materiales Académicos</h1>
                    <h2 className="repo-carrera-subtítulo">{carreraDecodificada}</h2>
                    
                    {loading ? (
                        <div className="loading-text">Cargando materiales...</div>
                    ) : materiales.length === 0 ? (
                        <div className="empty-text">
                            No hay materiales académicos disponibles para esta carrera
                        </div>
                    ) : (
                        <div className="repo-carrera-grid">
                            {materiales.map((material) => (
                                <div key={material.id_material} className="repo-carrera-card">
                                    <div className="card-icon"><DescriptionIcon /></div>
                                    <div className="card-content">
                                        <h3 className="card-título">{material.titulo}</h3>
                                        {material.descripcion && <p className="card-descripción">{material.descripcion}</p>}
                                        <div className="card-meta">
                                            {material.tamaño && <span className="card-tamaño">{material.tamaño}</span>}
                                        </div>
                                        <a href={material.archivo_url} target="_blank" rel="noopener noreferrer" className="card-btn">
                                            Descargar material
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
            
            <Footer />
        </div>
    );
};

export default RepositorioCarrera;