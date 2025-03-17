import React from 'react';
import { motion } from 'framer-motion';
import { Award, Shield, Leaf, Clock } from 'lucide-react';

const WhyUs = () => {
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
    <section className="why-us-section">
      <div className="container">
        <div className="section-header">
          <h2>Pourquoi choisir APS TAXIS ?</h2>
          <p>Un service de qualité qui fait la différence</p>
        </div>
        
        <motion.div 
          className="why-us-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div 
            className="why-us-card"
            variants={itemVariants}
            whileHover={{ 
              y: -10,
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)"
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="why-us-icon">
              <Award size={40} />
            </div>
            <h3>Qualité de service</h3>
            <p>
              Des prestations haut de gamme et une attention particulière 
              portée à votre confort.
            </p>
          </motion.div>
          
          <motion.div 
            className="why-us-card"
            variants={itemVariants}
            whileHover={{ 
              y: -10,
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)"
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="why-us-icon">
              <Clock size={40} />
            </div>
            <h3>Ponctualité</h3>
            <p>
              Nous garantissons votre prise en charge à l'heure convenue, 
              sans exception.
            </p>
          </motion.div>
          
          <motion.div 
            className="why-us-card"
            variants={itemVariants}
            whileHover={{ 
              y: -10,
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)"
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="why-us-icon">
              <Leaf size={40} />
            </div>
            <h3>Écologie</h3>
            <p>
              Une flotte de véhicules modernes incluant des options 
              électriques et hybrides.
            </p>
          </motion.div>
          
          <motion.div 
            className="why-us-card"
            variants={itemVariants}
            whileHover={{ 
              y: -10,
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)"
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="why-us-icon">
              <Shield size={40} />
            </div>
            <h3>Sécurité</h3>
            <p>
              Véhicules régulièrement entretenus et chauffeurs expérimentés 
              pour votre sécurité.
            </p>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="why-us-testimonial"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="testimonial-quote">
            <p>
              "Une grande majorité de nos clients reviennent vers nous pour 
              leurs déplacements réguliers. La satisfaction client est notre 
              priorité absolue, et nous mettons tout en œuvre pour vous offrir 
              un service exceptionnel à chaque trajet."
            </p>
            <div className="quote-author">
              <span className="author-name">L'équipe APS TAXIS</span>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="why-us-cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <p>Prêt à essayer notre service de qualité ?</p>
          <a href="/booking" className="btn btn-primary">
            Réserver maintenant
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyUs;