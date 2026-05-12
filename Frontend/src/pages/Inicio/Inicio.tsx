import "./Inicio.css"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"

import Navbar from "../../components/Navbar/Navbar"
import fondo from "../../assets/images/Inicio.jpg"

import Avisos from "../Avisos/Avisos"
import SobreNosotros from "../SobreNosotros/SobreNosotros"
import Servicios from "../Servicios/Servicios"
import Divisiones from "../Divisiones/Divisiones"
import Contacto from "../Contacto/Contacto"
import Footer from "../../components/Footer/Footer"

const Inicio = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const elemento = document.getElementById(id);
      if (elemento) {
        setTimeout(() => {
          elemento.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div>
      <Navbar />

      <section 
        id="inicio"
        className="hero"
        style={{ backgroundImage: `url(${fondo})` }}
      >
        <div className="overlay"></div>
        <Avisos />
      </section>

      <SobreNosotros/>
      <Servicios/>
      <Divisiones/>
      <Contacto/>
      <Footer/>
    </div>
  )
}

export default Inicio