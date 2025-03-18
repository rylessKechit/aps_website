import React from 'react';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BookingSimulator from '../booking/BookingSimulator';
import config from '../../config';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <motion.div 
            className="hero-text"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1>Votre taxi de confiance en Essonne</h1>
            <p>Service premium de transport pour tous vos déplacements dans le département 91 et la région parisienne.</p>
            <div className="hero-cta">
              <button onClick={() => navigate('/booking')} className="btn btn-primary">
                Réserver un taxi
              </button>
              <a href={`tel:${config.company.phone.replace(/\s/g, '')}`} className="btn btn-outline">
                <Phone size={18} />
                {config.company.phone}
              </a>
            </div>
          </motion.div>
          
          <motion.div 
            className="booking-card simulator-card"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <BookingSimulator />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;