import React from 'react';
import { useBooking } from '../../context/BookingContext';
import { MapPin, Navigation } from 'lucide-react';

// Composant simplifié qui affiche une carte statique ou un placeholder
// sans dépendre de l'API Google Maps
const MapViewSimplified = () => {
  const { bookingData, bookingStep } = useBooking();
  
  // Vérifier si nous avons les adresses nécessaires
  const hasAddresses = bookingData.pickupAddress && bookingData.destinationAddress;
  
  return (
    <div className="map-view-container">
      {hasAddresses ? (
        <div className="route-visualization">
          <div className="route-info">
            <div className="route-point pickup">
              <MapPin size={24} color="#4CAF50" />
              <div className="address-label">
                <h4>Point de départ</h4>
                <p>{bookingData.pickupAddress}</p>
              </div>
            </div>
            
            <div className="route-line">
              <svg height="80" width="30">
                <line x1="15" y1="0" x2="15" y2="80" stroke="#FFCA28" strokeWidth="2" strokeDasharray="5,5" />
              </svg>
            </div>
            
            <div className="route-point destination">
              <MapPin size={24} color="#F44336" />
              <div className="address-label">
                <h4>Destination</h4>
                <p>{bookingData.destinationAddress}</p>
              </div>
            </div>
          </div>
          
          <div className="map-placeholder">
            <div className="map-icon">
              <Navigation size={48} />
            </div>
            <h3>Trajet visualisé</h3>
            <p>Votre chauffeur prendra l'itinéraire optimal.</p>
          </div>
        </div>
      ) : (
        <div className="map-placeholder">
          <div className="map-icon">
            <MapPin size={48} />
          </div>
          <h3>Notre zone de service</h3>
          <p>Nous desservons tout le département de l'Essonne (91) et proposons des transferts vers les principaux aéroports et gares de la région parisienne.</p>
        </div>
      )}
    </div>
  );
};

export default MapViewSimplified;