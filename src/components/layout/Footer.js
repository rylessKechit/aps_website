import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, CreditCard, DollarSign } from 'lucide-react';
import config from '../../config';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <img src="/images/logo-white.png" alt={config.company.name} />
            <p>Votre partenaire de confiance pour tous vos déplacements en Essonne depuis plus de {currentYear - config.company.foundedYear} ans.</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h3>Services</h3>
              <ul>
                <li><Link to="/services#transferts-aeroports">Transferts aéroports</Link></li>
                <li><Link to="/services#transferts-gares">Transferts gares</Link></li>
                <li><Link to="/services#deplacements-pro">Déplacements professionnels</Link></li>
                <li><Link to="/services#transport-cpam">Transport CPAM</Link></li>
                <li><Link to="/services#mise-a-disposition">Mise à disposition</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>Destinations</h3>
              <ul>
                <li><Link to="/booking?to=orly">Aéroport d'Orly</Link></li>
                <li><Link to="/booking?to=cdg">Aéroport Roissy CDG</Link></li>
                <li><Link to="/booking?to=massy-tgv">Gare de Massy TGV</Link></li>
                <li><Link to="/booking?to=paris">Paris</Link></li>
                <li><Link to="/services#zone">Toute l'Essonne</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>Informations</h3>
              <ul>
                <li><Link to="/about">À propos de nous</Link></li>
                <li><Link to="/terms">Conditions générales</Link></li>
                <li><Link to="/privacy">Politique de confidentialité</Link></li>
                <li><Link to="/legal">Mentions légales</Link></li>
                <li><Link to="/blog">Blog</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} {config.company.name}. Tous droits réservés.</p>
          <div className="payment-methods">
            <CreditCard size={20} />
            <CreditCard size={20} />
            <CreditCard size={20} />
            <DollarSign size={20} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;