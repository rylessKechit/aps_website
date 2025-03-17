import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import BookingForm from '../components/booking/BookingForm';
import EstimationResult from '../components/booking/EstimationResult';
import BookingConfirmation from '../components/booking/BookingConfirmation';
import { useBooking } from '../context/BookingContext';
import MapView from '../components/booking/MapView';

const BookingPage = () => {
  const { bookingStep, setIsSimpleForm } = useBooking();
  
  // Utiliser le formulaire complet pour la page de réservation
  useEffect(() => {
    setIsSimpleForm(false);
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [setIsSimpleForm]);
  
  // Animation de transition entre les étapes
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };
  
  const pageTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.3
  };
  
  return (
    <div className="booking-page">
      <div className="container">
        <div className="page-header">
          <h1>Réservation de taxi</h1>
          <p>Réservez votre taxi en quelques clics pour tous vos déplacements</p>
        </div>
        
        <div className="booking-steps">
          <div className={`booking-step ${bookingStep === 'form' || bookingStep === 'estimation' || bookingStep === 'confirmation' ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-text">Informations</div>
          </div>
          <div className="step-divider"></div>
          <div className={`booking-step ${bookingStep === 'estimation' || bookingStep === 'confirmation' ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-text">Estimation</div>
          </div>
          <div className="step-divider"></div>
          <div className={`booking-step ${bookingStep === 'confirmation' ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-text">Confirmation</div>
          </div>
        </div>
        
        <div className="booking-content">
          <div className="booking-form-container">
            {bookingStep === 'form' && (
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="booking-section"
              >
                <h2>Détails de votre course</h2>
                <BookingForm isSimple={false} />
              </motion.div>
            )}
            
            {bookingStep === 'estimation' && (
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="booking-section"
              >
                <EstimationResult />
              </motion.div>
            )}
            
            {bookingStep === 'confirmation' && (
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="booking-section"
              >
                <BookingConfirmation />
              </motion.div>
            )}
          </div>
          
          <div className="booking-map-container">
            <MapView />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;