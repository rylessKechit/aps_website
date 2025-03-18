import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Testimonials = () => {
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
    autoplaySpeed: 6000,
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
  
  // Données des témoignages
  const testimonials = [
    {
      id: 1,
      name: 'Martine B.',
      location: 'Longjumeau',
      rating: 4.5,
      comment: "Très satisfaite de la prise en charge pour mes rendez-vous médicaux. Chauffeurs courtois et véhicules impeccables.",
    },
    {
      id: 2,
      name: 'Jean-Pierre M.',
      location: 'Évry',
      rating: 5,
      comment: "Je prends ce taxi chaque semaine pour me rendre à l'aéroport. Jamais un retard et toujours une conduite sécurisante.",
    },
    {
      id: 3,
      name: 'Nathalie R.',
      location: 'Orsay',
      rating: 5,
      comment: "Le chauffeur connaissait parfaitement la région. Très pratique quand on n'est pas du coin !",
    },
    {
      id: 4,
      name: 'Thomas D.',
      location: 'Palaiseau',
      rating: 5,
      comment: "J'utilise régulièrement APS TAXIS pour mes déplacements professionnels. Service fiable et de qualité à chaque fois.",
    },
    {
      id: 5,
      name: 'Sophie L.',
      location: 'Massy',
      rating: 5,
      comment: "Service exceptionnel ! Chauffeur ponctuel et très professionnel. Je recommande vivement pour tous vos déplacements en Essonne.",
    }
  ];
  
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
  
  // Fonction pour générer les étoiles
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} size={16} fill="#FFCA28" color="#FFCA28" />);
    }
    
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="half-star">
          <Star size={16} fill="#FFCA28" color="#FFCA28" style={{ clipPath: 'inset(0 50% 0 0)' }} />
          <Star size={16} color="#FFCA28" style={{ position: 'absolute', top: 0, left: 0 }} />
        </span>
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} color="#FFCA28" />);
    }
    
    return stars;
  };
  
  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="section-header">
          <h2>Témoignages clients</h2>
          <p>Ce que disent nos clients de notre service</p>
        </div>
        
        <motion.div 
          className="testimonials-slider-container"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <div className="slider-navigation">
            <button 
              className="slider-nav-btn prev-btn" 
              onClick={goToPrev}
              aria-label="Témoignage précédent"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button 
              className="slider-nav-btn next-btn" 
              onClick={goToNext}
              aria-label="Témoignage suivant"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          
          <Slider ref={sliderRef} {...sliderSettings}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-slide">
                <div className="testimonial-content">
                  <div className="rating">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="testimonial-text">"{testimonial.comment}"</p>
                  <div className="client-info">
                    <span className="client-name">{testimonial.name}</span>
                    <span className="client-location">{testimonial.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </motion.div>
        
        <div className="testimonials-cta">
          <p>Votre avis compte pour nous</p>
          <a 
            href="https://g.page/r/APS-TAXIS/review" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            Laisser un avis sur Google
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;