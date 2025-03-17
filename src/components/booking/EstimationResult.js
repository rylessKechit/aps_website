import React from 'react';
import { ArrowLeft, MapPin, Clock, Calendar, Users, Car } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { formatDate, formatTime } from '../../utils/dateHelpers';

const EstimationResult = () => {
  const { 
    bookingData, 
    estimationResults, 
    setBookingStep, 
    confirmBooking 
  } = useBooking();
  
  const handleBackToForm = () => {
    setBookingStep('form');
  };
  
  const handleConfirmBooking = () => {
    confirmBooking();
  };
  
  return (
    <div className="estimation-result">
      <div className="estimation-header">
        <button 
          type="button" 
          className="back-button"
          onClick={handleBackToForm}
        >
          <ArrowLeft size={18} />
          <span>Retour</span>
        </button>
        <h2>Détails de l'estimation</h2>
      </div>
      
      <div className="estimation-details">
        <div className="detail-row">
          <div className="detail-label">
            <MapPin size={18} />
            <span>Départ</span>
          </div>
          <div className="detail-value">{bookingData.pickupAddress}</div>
        </div>
        
        <div className="detail-row">
          <div className="detail-label">
            <MapPin size={18} />
            <span>Destination</span>
          </div>
          <div className="detail-value">{bookingData.destinationAddress}</div>
        </div>
        
        <div className="detail-row">
          <div className="detail-label">
            <Calendar size={18} />
            <span>Date</span>
          </div>
          <div className="detail-value">{formatDate(bookingData.pickupDate)}</div>
        </div>
        
        <div className="detail-row">
          <div className="detail-label">
            <Clock size={18} />
            <span>Heure</span>
          </div>
          <div className="detail-value">{formatTime(bookingData.pickupTime)}</div>
        </div>
        
        <div className="detail-row">
          <div className="detail-label">
            <Users size={18} />
            <span>Passagers</span>
          </div>
          <div className="detail-value">{bookingData.passengers}</div>
        </div>
        
        <div className="detail-row">
          <div className="detail-label">
            <Car size={18} />
            <span>Véhicule</span>
          </div>
          <div className="detail-value">{bookingData.vehicleType}</div>
        </div>
      </div>
      
      <div className="estimation-summary">
        <div className="summary-row">
          <span>Distance estimée</span>
          <span>{estimationResults.distance} km</span>
        </div>
        <div className="summary-row">
          <span>Durée estimée</span>
          <span>{estimationResults.duration} min</span>
        </div>
        <div className="summary-row total">
          <span>Prix estimé</span>
          <span>{estimationResults.price.toFixed(2)} €</span>
        </div>
      </div>
      
      <div className="estimation-notes">
        <p>Cette estimation est basée sur une circulation normale. Le prix final peut varier en fonction des conditions de circulation et d'éventuels arrêts supplémentaires.</p>
      </div>
      
      <div className="booking-actions">
        <button 
          type="button" 
          className="btn btn-primary btn-block"
          onClick={handleConfirmBooking}
        >
          Confirmer la réservation
        </button>
        <button 
          type="button" 
          className="btn btn-outline btn-block"
          onClick={handleBackToForm}
        >
          Modifier ma réservation
        </button>
      </div>
    </div>
  );
};

export default EstimationResult;