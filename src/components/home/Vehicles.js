import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import config from '../../config';

const Vehicles = () => {
  // Référence au slider pour contrôler la navigation
  const sliderRef = useRef(null);
  
  // Configuration du slider
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  
  // Navigation du slider
  const goToPrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };
  
  const goToNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };
  
  return (
    <section id="vehicules" className="vehicles-section">
      <div className="container">
        <div className="section-header">
          <h2>Notre flotte</h2>
          <p>Des véhicules récents et entretenus pour votre confort et sécurité</p>
        </div>
        
        <motion.div 
          className="vehicles-slider-container"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="slider-navigation">
            <button 
              className="slider-nav-btn prev-btn" 
              onClick={goToPrev}
              aria-label="Véhicule précédent"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button 
              className="slider-nav-btn next-btn" 
              onClick={goToNext}
              aria-label="Véhicule suivant"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          
          <Slider ref={sliderRef} {...sliderSettings}>
            {config.vehicles.types.map((vehicle) => (
              <div key={vehicle.id} className="vehicle-slide">
                <div className="vehicle-card">
                  <div className="vehicle-image">
                    <img 
                      src={`/images/vehicles/${vehicle.id}.jpg`} 
                      alt={vehicle.name} 
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x250?text=Véhicule';
                      }} 
                    />
                  </div>
                  <div className="vehicle-info">
                    <h3>{vehicle.name}</h3>
                    <p>{vehicle.description}</p>
                    <div className="vehicle-features">
                      <span>
                        <User size={16} />
                        {vehicle.capacity.passengers} passagers
                      </span>
                      <span>
                        <Briefcase size={16} />
                        {vehicle.capacity.luggage} bagages
                      </span>
                    </div>
                    <ul className="vehicle-amenities">
                      {vehicle.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </motion.div>
      </div>
    </section>
  );
};

export default Vehicles;