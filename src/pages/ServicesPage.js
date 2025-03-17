import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plane, 
  Train, 
  Briefcase, 
  Clock, 
  Heart, 
  Calendar,
  Check
} from 'lucide-react';
import config from '../config';

const ServicesPage = () => {
  const location = useLocation();
  
  // Défilement vers l'ancre si présente dans l'URL
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      
      if (element) {
        // Ajouter un délai pour permettre le rendu complet
        setTimeout(() => {
          window.scrollTo({
            top: element.offsetTop - 100,
            behavior: 'smooth'
          });
        }, 100);
      }
    } else {
      // Défiler vers le haut de la page
      window.scrollTo(0, 0);
    }
  }, [location]);
  
  // Helper function to get the appropriate icon
  const getServiceIcon = (iconName) => {
    switch (iconName) {
      case 'plane':
        return <Plane size={40} />;
      case 'train':
        return <Train size={40} />;
      case 'briefcase':
        return <Briefcase size={40} />;
      case 'clock':
        return <Clock size={40} />;
      case 'heart':
        return <Heart size={40} />;
      case 'calendar':
        return <Calendar size={40} />;
      default:
        return <Clock size={40} />;
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  
  return (
    <div className="services-page">
      <div className="page-hero">
        <div className="container">
          <h1>Nos services</h1>
          <p>Des solutions de transport adaptées à tous vos besoins</p>
        </div>
      </div>
      
      <div className="container">
        <div className="services-intro">
          <h2>Découvrez nos prestations premium</h2>
          <p>
            APS TAXIS propose une large gamme de services de transport pour répondre à tous vos besoins 
            de déplacement dans l'Essonne et la région parisienne. Nos chauffeurs expérimentés 
            et notre flotte de véhicules modernes vous garantissent un service de qualité, ponctuel 
            et confortable.
          </p>
        </div>
        
        <motion.div 
          className="services-list"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {config.services.map((service) => (
            <motion.div 
              key={service.id} 
              id={service.id} 
              className="service-item"
              variants={itemVariants}
            >
              <div className="service-icon">
                {getServiceIcon(service.icon)}
              </div>
              
              <div className="service-content">
                <h2>{service.name}</h2>
                <p>{service.description}</p>
                
                <div className="service-details">
                  {service.id === 'transferts-aeroports' && (
                    <>
                      <h3>Nos aéroports desservis</h3>
                      <ul className="service-features">
                        {config.destinations.airports.map((airport) => (
                          <li key={airport.id}>
                            <Check size={16} />
                            <span>{airport.name} ({airport.code})</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="service-benefit">
                        <h4>Avantages de notre service</h4>
                        <ul>
                          <li>Suivi des vols en temps réel</li>
                          <li>Attente gratuite en cas de retard d'avion (jusqu'à 45 minutes)</li>
                          <li>Chauffeur à l'arrivée avec panneau nominatif</li>
                          <li>Aide aux bagages</li>
                          <li>Sièges enfants disponibles sur demande</li>
                        </ul>
                      </div>
                    </>
                  )}
                  
                  {service.id === 'transferts-gares' && (
                    <>
                      <h3>Nos gares desservies</h3>
                      <ul className="service-features">
                        {config.destinations.stations.map((station) => (
                          <li key={station.id}>
                            <Check size={16} />
                            <span>{station.name}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="service-benefit">
                        <h4>Avantages de notre service</h4>
                        <ul>
                          <li>Ponctualité garantie</li>
                          <li>Attente gratuite en cas de retard du train (jusqu'à 30 minutes)</li>
                          <li>Chauffeur à l'arrivée</li>
                          <li>Aide aux bagages</li>
                          <li>Réservation facile via notre application ou par téléphone</li>
                        </ul>
                      </div>
                    </>
                  )}
                  
                  {service.id === 'deplacements-pro' && (
                    <>
                      <h3>Services pour professionnels</h3>
                      <div className="service-benefit">
                        <h4>Nos solutions entreprise</h4>
                        <ul>
                          <li>Compte entreprise avec facturation mensuelle</li>
                          <li>Réservation pour collaborateurs et clients</li>
                          <li>Transferts vers tous sites, salons professionnels, rendez-vous</li>
                          <li>Confidentialité garantie</li>
                          <li>WiFi à bord, prises de recharge</li>
                          <li>Véhicules premium sur demande</li>
                        </ul>
                      </div>
                    </>
                  )}
                  
                  {service.id === 'mise-a-disposition' && (
                    <>
                      <h3>Mise à disposition d'un chauffeur</h3>
                      <div className="service-benefit">
                        <h4>Options disponibles</h4>
                        <ul>
                          <li>Réservation à l'heure, à la demi-journée ou à la journée</li>
                          <li>Chauffeur dédié à votre service</li>
                          <li>Attente pendant vos rendez-vous</li>
                          <li>Idéal pour visites multiples, shopping, événements</li>
                          <li>Flexibilité totale sur votre itinéraire</li>
                        </ul>
                      </div>
                    </>
                  )}
                  
                  {service.id === 'transport-cpam' && (
                    <>
                      <h3>Transport médical conventionné</h3>
                      <div className="service-benefit">
                        <h4>Notre service CPAM</h4>
                        <ul>
                          <li>Transport conventionné par la CPAM</li>
                          <li>Véhicules adaptés et confortables</li>
                          <li>Chauffeurs formés au transport médical</li>
                          <li>Prise en charge des formalités administratives</li>
                          <li>Service ponctuel et fiable</li>
                        </ul>
                      </div>
                    </>
                  )}
                  
                  {service.id === 'service-24-7' && (
                    <>
                      <h3>À votre service 24h/24 et 7j/7</h3>
                      <div className="service-benefit">
                        <h4>Disponibilité permanente</h4>
                        <ul>
                          <li>Service disponible de jour comme de nuit</li>
                          <li>Réservation possible à toute heure</li>
                          <li>Équipe d'assistance joignable 24h/24</li>
                          <li>Service de qualité identique quelle que soit l'heure</li>
                          <li>Réservation anticipée ou immédiate possible</li>
                        </ul>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="service-cta">
                  <a href="/booking" className="btn btn-primary">Réserver ce service</a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ServicesPage;