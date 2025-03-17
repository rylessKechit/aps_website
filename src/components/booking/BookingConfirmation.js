import React from 'react';
import { CheckCircle, Calendar, Clock, MapPin } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { formatDate, formatTime } from '../../utils/dateHelpers';

const BookingConfirmation = () => {
  const { 
    bookingData, 
    estimationResults, 
    startNewBooking 
  } = useBooking();
  
  return (
    <div className="booking-confirmation">
      <div className="confirmation-message">
        <CheckCircle size={60} className="confirmation-icon" />
        <h2>Réservation confirmée !</h2>
        <p>Votre taxi a été réservé avec succès.</p>
      </div>
      
      <div className="booking-reference">
        <h3>Numéro de réservation</h3>
        <p className="reference-number">{estimationResults.bookingRef}</p>
        <p className="reference-note">Veuillez conserver ce numéro pour toute communication avec notre service client.</p>
      </div>
      
      <div className="booking-summary">
        <div className="summary-item">
          <div className="summary-icon">
            <Calendar size={20} />
          </div>
          <div className="summary-content">
            <h4>Date et heure</h4>
            <p>{formatDate(bookingData.pickupDate)} à {formatTime(bookingData.pickupTime)}</p>
          </div>
        </div>
        
        <div className="summary-item">
          <div className="summary-icon">
            <MapPin size={20} />
          </div>
          <div className="summary-content">
            <h4>Trajet</h4>
            <p>
              <strong>De :</strong> {bookingData.pickupAddress}
              <br />
              <strong>À :</strong> {bookingData.destinationAddress}
            </p>
          </div>
        </div>
        
        <div className="summary-divider"></div>
        
        <div className="price-summary">
          <div className="price-row">
            <span>Prix estimé</span>
            <span>{estimationResults.price.toFixed(2)} €</span>
          </div>
        </div>
      </div>
      
      <div className="confirmation-info">
        <h3>Prochaines étapes</h3>
        <ul>
          <li>Un email de confirmation a été envoyé à votre adresse.</li>
          <li>Vous recevrez un SMS 30 minutes avant l'arrivée de votre chauffeur.</li>
          <li>Notre chauffeur vous contactera à l'approche de l'heure de prise en charge.</li>
        </ul>
      </div>
      
      <div className="confirmation-actions">
        <button 
          type="button" 
          className="btn btn-primary btn-block"
          onClick={startNewBooking}
        >
          Nouvelle réservation
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation;