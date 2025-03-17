import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plane, 
  Train, 
  Briefcase, 
  Clock, 
  Heart, 
  Calendar 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import config from '../../config';

const Services = () => {
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
  
  // Helper function to get the appropriate icon
  const getServiceIcon = (iconName) => {
    switch (iconName) {
      case 'plane':
        return <Plane size={30} />;
      case 'train':
        return <Train size={30} />;
      case 'briefcase':
        return <Briefcase size={30} />;
      case 'clock':
        return <Clock size={30} />;
      case 'heart':
        return <Heart size={30} />;
      case 'calendar':
        return <Calendar size={30} />;
      default:
        return <Clock size={30} />;
    }
  };
  
  return (
    <section id="services" className="services-section">
      <div className="container">
        <div className="section-header">
          <h2>Nos services</h2>
          <p>Des solutions de transport adaptées à tous vos besoins</p>
        </div>
        
        <motion.div 
          className="services-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {config.services.map((service, index) => (
            <motion.div 
              key={service.id} 
              className="service-card"
              variants={itemVariants}
            >
              <div className="service-icon">
                {getServiceIcon(service.icon)}
              </div>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <Link 
                to={`/services#${service.id}`} 
                className="service-link"
              >
                En savoir plus
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;