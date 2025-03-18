import React from 'react';
import { CheckCircle, Calendar, Clock, MapPin, Users, Briefcase, Phone, Mail, User } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { formatDate, formatTime } from '../../utils/dateHelpers';
import { formatPrice, formatDistance, formatDuration } from '../../utils/pricing';
import config from '../../config';

const BookingConfirmation = () => {
  const { 
    bookingData, 
    estimationResults, 
    startNewBooking 
  } = useBooking();
  
  // Trouver le nom du véhicule
  const getVehicleName = () => {
    const vehicle = config.vehicles.types.find(v => v.id === bookingData.vehicleType);
    return vehicle ? vehicle.name : bookingData.vehicleType;
  };
  
  // Formater le temps d'attente estimé avant l'arrivée
  const getEstimatedArrival = () => {
    const now = new Date();
    const pickupDate = new Date(bookingData.pickupDate);
    pickupDate.setHours(
      bookingData.pickupTime.getHours(),
      bookingData.pickupTime.getMinutes(),
      0, 0
    );
    
    const diffInMs = pickupDate.getTime() - now.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.round(diffInHours * 60);
      return `environ ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      const minutes = Math.round((diffInHours - hours) * 60);
      return `environ ${hours} heure${hours > 1 ? 's' : ''}${minutes > 0 ? ` et ${minutes} minute${minutes > 1 ? 's' : ''}` : ''}`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days} jour${days > 1 ? 's' : ''}`;
    }
  };
  
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
        
        <div className="summary-item">
          <div className="summary-icon">
            <Users size={20} />
          </div>
          <div className="summary-content">
            <h4>Passagers et bagages</h4>
            <p>{bookingData.passengers} passager(s), {bookingData.luggage} bagage(s)</p>
          </div>
        </div>
        
        <div className="summary-item">
          <div className="summary-icon">
            <Briefcase size={20} />
          </div>
          <div className="summary-content">
            <h4>Véhicule</h4>
            <p>{getVehicleName()}</p>
          </div>
        </div>
        
        <div className="summary-divider"></div>
        
        <div className="summary-item">
          <div className="summary-icon">
            <User size={20} />
          </div>
          <div className="summary-content">
            <h4>Vos coordonnées</h4>
            <p>
              <strong>Nom :</strong> {bookingData.customerName}
              <br />
              <Phone size={14} className="inline-icon" /> {bookingData.customerPhone}
              <br />
              <Mail size={14} className="inline-icon" /> {bookingData.customerEmail}
            </p>
          </div>
        </div>
        
        {bookingData.notes && (
          <div className="summary-item">
            <div className="summary-icon">
              <div style={{ width: 20 }}></div>
            </div>
            <div className="summary-content">
              <h4>Notes</h4>
              <p>{bookingData.notes}</p>
            </div>
          </div>
        )}
        
        <div className="summary-divider"></div>
        
        <div className="price-summary">
          <div className="summary-details">
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
          </div>
          <div className="price-row">
            <span>Prix estimé</span>
            <span>{formatPrice(estimationResults.price)}</span>
          </div>
        </div>
      </div>
      
      <div className="confirmation-info">
        <h3>Prochaines étapes</h3>
        <ul>
          <li>Un email de confirmation a été envoyé à votre adresse.</li>
          <li>Votre chauffeur arrivera dans {getEstimatedArrival()}.</li>
          <li>Vous recevrez un SMS 15 minutes avant l'arrivée de votre chauffeur.</li>
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