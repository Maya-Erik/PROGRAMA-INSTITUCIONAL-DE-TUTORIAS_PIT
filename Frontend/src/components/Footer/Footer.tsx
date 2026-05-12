import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">
          Hecho en México, todos los derechos reservados 2026.
          <br />
          Esta página puede ser reproducida con fines no lucrativos, siempre y cuando no se mutile, 
          se cite la fuente completa y su dirección electrónica. De otra forma, requiere permiso 
          previo por escrito de la institución.
        </p>
      </div>
    </footer>
  );
};

export default Footer;