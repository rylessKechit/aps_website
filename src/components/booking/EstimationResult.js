import React, { useState } from 'react';
import { ArrowLeft, MapPin, Clock, Calendar, Users, Briefcase, Car } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { formatDate, formatTime } from '../../utils/dateHelpers';
import { formatPrice, formatDistance, formatDuration } from '../../utils/pricing';
import config from '../../config';

const EstimationResult = () => {
  const { 
    bookingData, 
    estimationResults, 
    setBookingStep, 
    confirmBooking,
    updateBookingData 
  } = useBooking();
  
  // États pour les informations client
  const [customerName, setCustomerName] = useState(bookingData.customerName || '');
  const [customerPhone, setCustomerPhone] = useState(bookingData.customerPhone || '');
  const [customerEmail, setCustomerEmail] = useState(bookingData.customerEmail || '');
  const [notes, setNotes] = useState(bookingData.notes || '');
  const [errors, setErrors] = useState({});
  
  // Trouver le nom du véhicule
  const getVehicleName = () => {
    const vehicle = config.vehicles.types.find(v => v.id === bookingData.vehicleType);
    return vehicle ? vehicle.name : bookingData.vehicleType;
  };
  
  // Retourner au formulaire de réservation
  const handleBackToForm = () => {
    setBookingStep('form');
  };
  
  // Valider le formulaire
  const validateForm = () => {
    const newErrors = {};
    
    if (!customerName.trim()) {
      newErrors.customerName = 'Veuillez entrer votre nom';
    }
    
    if (!customerPhone.trim()) {
      newErrors.customerPhone = 'Veuillez entrer votre numéro de téléphone';
    } else if (!/^[+\d\s()-]{10,20}$/.test(customerPhone)) {
      newErrors.customerPhone = 'Numéro de téléphone invalide';
    }
    
    if (!customerEmail.trim()) {
      newErrors.customerEmail = 'Veuillez entrer votre email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      newErrors.customerEmail = 'Email invalide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Confirmer la réservation
  const handleConfirmBooking = () => {
    if (validateForm()) {
      // Mettre à jour les données client
      updateBookingData({
        customerName,
        customerPhone,
        customerEmail,
        notes
      });
      
      // Confirmer la réservation
      confirmBooking();
    }
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
            <Briefcase size={18} />
            <span>Bagages</span>
          </div>
          <div className="detail-value">{bookingData.luggage}</div>
        </div>
        
        <div className="detail-row">
          <div className="detail-label">
            <Car size={18} />
            <span>Véhicule</span>
          </div>
          <div className="detail-value">{getVehicleName()}</div>
        </div>
      </div>
      
      <div className="estimation-summary">
        <div className="summary-row">
          <span>Distance estimée</span>
          <span>{formatDistance(estimationResults.distance)}</span>
        </div>
        <div className="summary-row">
          <span>Durée estimée</span>
          <span>{formatDuration(estimationResults.duration)}</span>
        </div>
        {estimationResults.isAirport && (
          <div className="summary-row">
            <span>Supplément aéroport</span>
            <span>{formatPrice(config.pricing.airportSupplement)}</span>
          </div>
        )}
        {estimationResults.isStation && !estimationResults.isAirport && (
          <div className="summary-row">
            <span>Supplément gare</span>
            <span>{formatPrice(config.pricing.stationSupplement)}</span>
          </div>
        )}
        {estimationResults.isNightFare && (
          <div className="summary-row">
            <span>Supplément de nuit</span>
            <span>{formatPrice(config.pricing.nightSupplement)}</span>
          </div>
        )}
        <div className="summary-row total">
          <span>Prix estimé</span>
          <span>{formatPrice(estimationResults.price)}</span>
        </div>
      </div>
      
      <div className="estimation-notes">
        <p>Cette estimation est basée sur une circulation normale. Le prix final peut varier en fonction des conditions de circulation et d'éventuels arrêts supplémentaires.</p>
      </div>
      
      <div className="user-info-form">
        <h3>Vos informations</h3>
        <div className="form-group">
          <label htmlFor="customerName">Nom complet*</label>
          <input
            type="text"
            id="customerName"
            className={`form-control ${errors.customerName ? 'error' : ''}`}
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Votre nom et prénom"
            required
          />
          {errors.customerName && <div className="error-message">{errors.customerName}</div>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="customerPhone">Téléphone*</label>
            <input
              type="tel"
              id="customerPhone"
              className={`form-control ${errors.customerPhone ? 'error' : ''}`}
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Votre numéro de téléphone"
              required
            />
            {errors.customerPhone && <div className="error-message">{errors.customerPhone}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="customerEmail">Email*</label>
            <input
              type="email"
              id="customerEmail"
              className={`form-control ${errors.customerEmail ? 'error' : ''}`}
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="Votre adresse email"
              required
            />
            {errors.customerEmail && <div className="error-message">{errors.customerEmail}</div>}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Notes supplémentaires</label>
          <textarea
            id="notes"
            className="form-control"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Informations complémentaires pour le chauffeur"
            rows="3"
          ></textarea>
        </div>
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