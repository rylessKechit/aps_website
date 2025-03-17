import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone } from 'lucide-react';
import BookingForm from '../booking/BookingForm';
import { useBooking } from '../../context/BookingContext';
import config from '../../config';

const Hero = () => {
  const navigate = useNavigate();
  const { isSimpleForm } = useBooking();

  const handleCompleteBooking = () => {
    navigate('/booking');
  };

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
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
          </div>
          
          <div className="booking-card">
            <h2>Réservez votre course</h2>
            <BookingForm 
              isSimple={isSimpleForm} 
              onCompleteBooking={handleCompleteBooking} 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;