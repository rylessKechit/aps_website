import React from 'react';
import { MapPin, Route, Clock } from 'lucide-react';

const ServiceArea = () => {
  return (
    <section className="service-area-section">
      <div className="container">
        <div className="section-header">
          <h2>Notre zone de service</h2>
          <p>Une large couverture dans l'Essonne et au-delà</p>
        </div>
        
        <div className="service-area-content">
          <div className="map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d168159.6875879403!2d2.1347573923876954!3d48.630812!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e5d9d6694856a5%3A0x30b82c3688b2b70!2sEssonne!5e0!3m2!1sfr!2sfr!4v1710700000000!5m2!1sfr!2sfr" 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Carte de l'Essonne"
            ></iframe>
          </div>
          
          <div className="area-info">
            <h3>APS TAXIS dessert tout le département de l'Essonne (91)</h3>
            
            <p>
              Que vous soyez à Massy, Palaiseau, Longjumeau, Verrières-le-Buisson, Orsay, 
              ou dans n'importe quelle commune de l'Essonne, notre flotte est à votre disposition.
            </p>
            
            <div className="service-highlights">
              <div className="highlight">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <div>
                  <h4>Connaissance parfaite du territoire</h4>
                  <p>Nos chauffeurs expérimentés connaissent les itinéraires les plus rapides.</p>
                </div>
              </div>
              
              <div className="highlight">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <div>
                  <h4>Service rapide et ponctuel</h4>
                  <p>Nous garantissons votre prise en charge dans les meilleurs délais.</p>
                </div>
              </div>
              
              <div className="highlight">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 6 15 12 9 18"></polyline>
                </svg>
                <div>
                  <h4>Trajets réguliers et longue distance</h4>
                  <p>Adaptés à tous vos besoins de déplacement, professionnels ou personnels.</p>
                </div>
              </div>
            </div>
            
            <div className="common-destinations">
              <h4>Destinations populaires</h4>
              <div className="destination-tags">
                <span className="destination-tag">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  Aéroport d'Orly
                </span>
                <span className="destination-tag">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  Aéroport CDG
                </span>
                <span className="destination-tag">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  Gare de Massy TGV
                </span>
                <span className="destination-tag">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  Paris
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceArea;