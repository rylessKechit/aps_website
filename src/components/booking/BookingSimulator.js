import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, ArrowRight, ArrowLeft, Clock, MapPin, Calendar, Users, CreditCard } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import GooglePlacesAutocomplete from './GooglePlacesAutocomplete';
import { calculatePrice, formatPrice, isAirportTransfer, isNightFare } from '../../utils/pricing';
import VehicleSelector from './VehicleSelector';
import config from '../../config';

const BookingSimulator = () => {
  const navigate = useNavigate();
  
  // États pour les données de réservation
  const [formData, setFormData] = useState({
    pickupDate: new Date(),
    pickupTime: new Date(new Date().setHours(new Date().getHours() + 1, 0, 0, 0)),
    pickupAddress: '',
    destinationAddress: '',
    passengers: 1,
    luggage: 0,
    vehicleType: 'berline'
  });
  
  // État pour l'affichage du résultat de la simulation
  const [showResult, setShowResult] = useState(false);
  
  // État pour les résultats de la simulation
  const [simulationResult, setSimulationResult] = useState({
    distance: 0,
    duration: 0,
    price: 0,
    isAirport: false,
    isNightFare: false
  });
  
  // État pour le chargement
  const [isLoading, setIsLoading] = useState(false);
  
  // Gérer le changement des champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Gérer le changement de la date
  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      pickupDate: date
    }));
  };
  
  // Gérer le changement de l'heure
  const handleTimeChange = (time) => {
    setFormData(prev => ({
      ...prev,
      pickupTime: time
    }));
  };
  
  // Gérer la sélection du véhicule
  const handleVehicleSelect = (vehicleType) => {
    setFormData(prev => ({
      ...prev,
      vehicleType
    }));
  };
  
  // Simuler la distance entre deux points (en production, utilisez Google Distance Matrix API)
  const simulateDistance = (origin, destination) => {
    // Vérifier si c'est un trajet aéroport
    const isAirport = isAirportTransfer(origin, destination);
    
    // Simuler une distance en fonction du type de trajet
    if (isAirport) {
      return {
        distance: Math.random() * (40 - 25) + 25, // 25-40 km pour un aéroport
        duration: Math.random() * (60 - 30) + 30, // 30-60 minutes
      };
    } else {
      return {
        distance: Math.random() * (25 - 5) + 5, // 5-25 km pour un trajet local
        duration: Math.random() * (40 - 10) + 10, // 10-40 minutes
      };
    }
  };
  
  // Simuler la réservation
  const simulateBooking = async () => {
    // Vérifier que les champs sont remplis
    if (!formData.pickupAddress || !formData.destinationAddress) {
      alert('Veuillez renseigner les adresses de départ et de destination.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simuler le calcul de distance et durée
      const { distance, duration } = simulateDistance(
        formData.pickupAddress,
        formData.destinationAddress
      );
      
      // Déterminer si c'est un trajet aéroport
      const isAirport = isAirportTransfer(formData.pickupAddress, formData.destinationAddress);
      
      // Déterminer si c'est un tarif de nuit
      const isNight = isNightFare(formData.pickupTime);
      
      // Calculer le prix
      const price = calculatePrice({
        distance,
        duration,
        vehicleType: formData.vehicleType,
        isAirport,
        isNightFare: isNight
      });
      
      // Mettre à jour les résultats
      setSimulationResult({
        distance: parseFloat(distance.toFixed(1)),
        duration: Math.round(duration),
        price,
        isAirport,
        isNightFare: isNight
      });
      
      // Afficher les résultats
      setShowResult(true);
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 800));
    } catch (error) {
      console.error('Erreur lors de la simulation:', error);
      alert('Une erreur s\'est produite lors de la simulation. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Revenir au formulaire
  const handleBackToForm = () => {
    setShowResult(false);
  };
  
  // Rediriger vers la page de réservation complète
  const handleProceedToBooking = () => {
    // En production, vous voudriez stocker ces données dans un contexte ou localStorage
    // pour les récupérer sur la page de réservation
    navigate('/booking', { 
      state: { 
        formData,
        simulationResult
      }
    });
  };
  
  return (
    <div className="booking-simulator">
      <h2 className="simulator-title">Simulez votre course</h2>
      
      {!showResult ? (
        <div className="simulator-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pickupDate">Date</label>
              <div className="input-icon-wrapper">
                <Calendar size={18} className="input-icon" />
                <DatePicker
                  id="pickupDate"
                  selected={formData.pickupDate}
                  onChange={handleDateChange}
                  minDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="pickupTime">Heure</label>
              <div className="input-icon-wrapper">
                <Clock size={18} className="input-icon" />
                <DatePicker
                  id="pickupTime"
                  selected={formData.pickupTime}
                  onChange={handleTimeChange}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Heure"
                  dateFormat="HH:mm"
                  className="form-control"
                />
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <GooglePlacesAutocomplete
              id="pickupAddress"
              name="pickupAddress"
              value={formData.pickupAddress}
              onChange={handleChange}
              placeholder="Adresse de départ"
              label="Départ"
              required
            />
          </div>
          
          <div className="form-group">
            <GooglePlacesAutocomplete
              id="destinationAddress"
              name="destinationAddress"
              value={formData.destinationAddress}
              onChange={handleChange}
              placeholder="Adresse de destination"
              label="Destination"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="passengers">Passagers</label>
              <div className="input-icon-wrapper">
                <Users size={18} className="input-icon" />
                <select
                  id="passengers"
                  name="passengers"
                  value={formData.passengers}
                  onChange={handleChange}
                  className="form-control"
                >
                  {Array.from({ length: config.booking.maxPassengers }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="luggage">Bagages</label>
              <div className="input-icon-wrapper">
                <CreditCard size={18} className="input-icon" />
                <select
                  id="luggage"
                  name="luggage"
                  value={formData.luggage}
                  onChange={handleChange}
                  className="form-control"
                >
                  {Array.from({ length: config.booking.maxLuggage + 1 }, (_, i) => i).map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="form-group vehicle-selection">
            <label>Type de véhicule</label>
            <VehicleSelector 
              selected={formData.vehicleType} 
              onChange={handleVehicleSelect} 
            />
          </div>
          
          <button 
            type="button" 
            className="btn btn-primary btn-block simulator-button"
            onClick={simulateBooking}
            disabled={isLoading}
          >
            {isLoading ? 'Calcul en cours...' : 'Simuler ma course'}
            {!isLoading && <ArrowRight size={18} className="btn-icon" />}
          </button>
        </div>
      ) : (
        <div className="simulator-result">
          <div className="result-header">
            <button 
              type="button" 
              className="back-button"
              onClick={handleBackToForm}
            >
              <ArrowLeft size={18} />
              <span>Modifier</span>
            </button>
            <h3>Estimation de votre course</h3>
          </div>
          
          <div className="result-details">
            <div className="detail-row">
              <div className="detail-label">
                <MapPin size={18} />
                <span>Trajet</span>
              </div>
              <div className="detail-value">
                {formData.pickupAddress.length > 30 
                  ? formData.pickupAddress.substring(0, 30) + '...' 
                  : formData.pickupAddress} 
                {' → '} 
                {formData.destinationAddress.length > 30 
                  ? formData.destinationAddress.substring(0, 30) + '...' 
                  : formData.destinationAddress}
              </div>
            </div>
            
            <div className="detail-row">
              <div className="detail-label">
                <Car size={18} />
                <span>Véhicule</span>
              </div>
              <div className="detail-value">
                {config.vehicles.types.find(v => v.id === formData.vehicleType)?.name || formData.vehicleType}
              </div>
            </div>
            
            <div className="result-summary">
              <div className="summary-row">
                <span>Distance estimée</span>
                <span>{simulationResult.distance} km</span>
              </div>
              
              <div className="summary-row">
                <span>Durée estimée</span>
                <span>{simulationResult.duration} min</span>
              </div>
              
              {simulationResult.isAirport && (
                <div className="summary-row">
                  <span>Supplément aéroport</span>
                  <span>+{config.pricing.airportSupplement} €</span>
                </div>
              )}
              
              {simulationResult.isNightFare && (
                <div className="summary-row">
                  <span>Supplément nuit</span>
                  <span>+{config.pricing.nightSupplement} €</span>
                </div>
              )}
              
              <div className="summary-row total">
                <span>Prix estimé</span>
                <span>{formatPrice(simulationResult.price)}</span>
              </div>
            </div>
          </div>
          
          <div className="simulator-actions">
            <button 
              type="button" 
              className="btn btn-primary btn-block"
              onClick={handleProceedToBooking}
            >
              Réserver maintenant
              <ArrowRight size={18} className="btn-icon" />
            </button>
            
            <button 
              type="button" 
              className="btn btn-outline btn-block"
              onClick={handleBackToForm}
            >
              Modifier ma course
            </button>
          </div>
          
          <div className="simulator-note">
            <p>Cette estimation est indicative et peut varier en fonction des conditions de circulation.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingSimulator;