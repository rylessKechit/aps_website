import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Smartphone, Clock, MapPin, CreditCard } from 'lucide-react';

const AppPromotion = () => {
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
    <section className="app-section">
      <div className="container">
        <motion.div 
          className="app-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div className="app-info" variants={itemVariants}>
            <h2>Simplifiez vos réservations avec notre application</h2>
            <p>
              Téléchargez notre application mobile pour des réservations rapides et pratiques, 
              disponible 24/7.
            </p>
            
            <ul className="app-features">
              <li>
                <CheckCircle size={18} />
                <span>Réservez en quelques clics</span>
              </li>
              <li>
                <CheckCircle size={18} />
                <span>Suivez votre chauffeur en temps réel</span>
              </li>
              <li>
                <CheckCircle size={18} />
                <span>Gérez vos paiements en toute sécurité</span>
              </li>
              <li>
                <CheckCircle size={18} />
                <span>Accédez à votre historique de courses</span>
              </li>
            </ul>
            
            <div className="app-benefits">
              <div className="app-benefit">
                <div className="benefit-icon">
                  <Clock size={24} />
                </div>
                <div className="benefit-content">
                  <h4>Gain de temps</h4>
                  <p>Réservez en moins de 30 secondes</p>
                </div>
              </div>
              
              <div className="app-benefit">
                <div className="benefit-icon">
                  <MapPin size={24} />
                </div>
                <div className="benefit-content">
                  <h4>Géolocalisation</h4>
                  <p>Suivez l'arrivée de votre chauffeur</p>
                </div>
              </div>
              
              <div className="app-benefit">
                <div className="benefit-icon">
                  <CreditCard size={24} />
                </div>
                <div className="benefit-content">
                  <h4>Paiement sécurisé</h4>
                  <p>Payez directement via l'application</p>
                </div>
              </div>
            </div>
            
            <div className="app-download">
              <a href="#" className="app-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#424242">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <span>Google Play</span>
              </a>
              <a href="#" className="app-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#424242">
                  <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                </svg>
                <span>App Store</span>
              </a>
            </div>
          </motion.div>
          
          <motion.div 
            className="app-image"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Smartphone size={300} strokeWidth={0.5} />
            <img 
              src="/images/app-screen.jpg" 
              alt="Application APS TAXIS" 
              className="app-screenshot"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AppPromotion;