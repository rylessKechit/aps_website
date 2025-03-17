import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from 'lucide-react';

/**
 * Bouton flottant de réservation pour mobile
 * Apparaît uniquement sur les petits écrans
 */
const MobileBookingButton = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/booking');
  };
  
  return (
    <button 
      className="mobile-booking-btn"
      onClick={handleClick}
      aria-label="Réserver un taxi"
    >
      <Car size={24} />
    </button>
  );
};

export default MobileBookingButton;