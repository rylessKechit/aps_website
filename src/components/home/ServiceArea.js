import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Route, Clock } from 'lucide-react';
import config from '../../config';

const ServiceArea = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
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
    <section id="zone" className="service-area-section">
      <div className="container">
        <div className="section-header">
          <h2>Notre zone de service</h2>
          <p>Une large couverture dans l'Essonne et au-delà</p>
        </div>
        
        <div className="service-area-content">
          <motion.div 
            className="map-container"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d168159.6875879403!2d2.1347573923876954!3d48.630812!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e5d9d6694856a5%3A0x30b82c3688b2b70!2sEssonne!5e0!3m2!1sfr!2sfr!4v1710700000000!5m2!1sfr!2sfr" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Carte de l'Essonne"
            ></iframe>
          </motion.div>
          
          <motion.div 
            className="area-info"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.h3 variants={itemVariants}>
              APS TAXIS dessert tout le département de l'Essonne (91)
            </motion.h3>
            
            <motion.p variants={itemVariants}>
              Que vous soyez à {config.destinations.cities.slice(0, 5).join(', ')}, 
              ou dans n'importe quelle commune de l'Essonne, notre flotte est à votre disposition.
            </motion.p>
            
            <div className="service-highlights">
              <motion.div className="highlight" variants={itemVariants}>
                <MapPin size={30} />
                <div>
                  <h4>Connaissance parfaite du territoire</h4>
                  <p>Nos chauffeurs expérimentés connaissent les itinéraires les plus rapides.</p>
                </div>
              </motion.div>
              
              <motion.div className="highlight" variants={itemVariants}>
                <Clock size={30} />
                <div>
                  <h4>Service rapide et ponctuel</h4>
                  <p>Nous garantissons votre prise en charge dans les meilleurs délais.</p>
                </div>
              </motion.div>
              
              <motion.div className="highlight" variants={itemVariants}>
                <Route size={30} />
                <div>
                  <h4>Trajets réguliers et longue distance</h4>
                  <p>Adaptés à tous vos besoins de déplacement, professionnels ou personnels.</p>
                </div>
              </motion.div>
            </div>
            
            <motion.div className="common-destinations" variants={itemVariants}>
              <h4>Destinations populaires</h4>
              <div className="destination-tags">
                {config.destinations.airports.map(airport => (
                  <span key={airport.id} className="destination-tag">
                    <MapPin size={14} />
                    {airport.name}
                  </span>
                ))}
                
                {config.destinations.stations.slice(0, 4).map(station => (
                  <span key={station.id} className="destination-tag">
                    <MapPin size={14} />
                    {station.name}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServiceArea;