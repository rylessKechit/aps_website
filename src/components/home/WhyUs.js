import React from 'react';
import { motion } from 'framer-motion';
import { Award, Clock, Leaf, Shield } from 'lucide-react';

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
  
  // Données des avantages
  const advantages = [
    {
      id: 'quality',
      icon: <Award size={40} />,
      title: 'Qualité de service',
      description: 'Des prestations haut de gamme et une attention particulière portée à votre confort.'
    },
    {
      id: 'punctuality',
      icon: <Clock size={40} />,
      title: 'Ponctualité',
      description: 'Nous garantissons votre prise en charge à l\'heure convenue, sans exception.'
    },
    {
      id: 'ecology',
      icon: <Leaf size={40} />,
      title: 'Écologie',
      description: 'Une flotte de véhicules modernes incluant des options électriques et hybrides.'
    },
    {
      id: 'security',
      icon: <Shield size={40} />,
      title: 'Sécurité',
      description: 'Véhicules régulièrement entretenus et chauffeurs expérimentés pour votre sécurité.'
    }
  ];
  
  return (
    <section className="why-us-section">
      <div className="container">
        <div className="section-header">
          <h2>Pourquoi choisir APS TAXIS ?</h2>
          <div className="section-divider"></div>
          <p>Un service de qualité qui fait la différence</p>
        </div>
        
        <motion.div 
          className="advantages-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {advantages.map((advantage) => (
            <motion.div 
              key={advantage.id} 
              className="advantage-card"
              variants={itemVariants}
              whileHover={{ 
                y: -10,
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)"
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="advantage-icon">
                {advantage.icon}
              </div>
              <h3>{advantage.title}</h3>
              <p>{advantage.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyUs;