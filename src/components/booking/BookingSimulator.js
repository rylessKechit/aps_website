import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Calendar, Clock } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { isAirportTransfer, isNightFare, calculatePrice, formatPrice } from '../../utils/pricing';
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

  // Gérer l'incrémentation/décrémentation des passagers et bagages
  const handleNumberChange = (field, increment) => {
    setFormData(prev => {
      let newValue;
      if (field === 'passengers') {
        newValue = increment 
          ? Math.min(prev.passengers + 1, config.booking.maxPassengers) 
          : Math.max(prev.passengers - 1, 1);
      } else if (field === 'luggage') {
        newValue = increment 
          ? Math.min(prev.luggage + 1, config.booking.maxLuggage) 
          : Math.max(prev.luggage - 1, 0);
      }
      
      return {
        ...prev,
        [field]: newValue
      };
    });
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
  const simulateBooking = async (e) => {
    e.preventDefault();
    
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
    navigate('/booking', { 
      state: { 
        formData,
        simulationResult
      }
    });
  };
  
  return (
    <div className="simulator-container">
      <h2 className="simulator-title">Simulez votre course</h2>
      
      {!showResult ? (
        <form className="simulator-form" onSubmit={simulateBooking}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pickupDate">Date</label>
              <div className="address-input-wrapper">
                <DatePicker
                  id="pickupDate"
                  selected={formData.pickupDate}
                  onChange={handleDateChange}
                  minDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                />
                <Calendar className="address-input-icon" size={18} />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="pickupTime">Heure</label>
              <div className="address-input-wrapper">
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
                <Clock className="address-input-icon" size={18} />
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <div className="address-input-wrapper">
              <input
                type="text"
                id="pickupAddress"
                name="pickupAddress"
                value={formData.pickupAddress}
                onChange={handleChange}
                className="form-control"
                placeholder="Adresse de départ"
                required
              />
              <MapPin className="address-input-icon" size={18} />
            </div>
            <label htmlFor="pickupAddress" className="sr-only">Départ*</label>
          </div>
          
          <div className="form-group">
            <div className="address-input-wrapper">
              <input
                type="text"
                id="destinationAddress"
                name="destinationAddress"
                value={formData.destinationAddress}
                onChange={handleChange}
                className="form-control"
                placeholder="Adresse de destination"
                required
              />
              <MapPin className="address-input-icon" size={18} />
            </div>
            <label htmlFor="destinationAddress" className="sr-only">Destination*</label>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="passengers">Passagers</label>
              <div className="number-input-container">
                <input
                  type="number"
                  id="passengers"
                  name="passengers"
                  value={formData.passengers}
                  onChange={handleChange}
                  className="form-control number-input"
                  min="1"
                  max={config.booking.maxPassengers}
                  readOnly
                />
                <button 
                  type="button" 
                  className="number-control decrement"
                  onClick={() => handleNumberChange('passengers', false)}
                  disabled={formData.passengers <= 1}
                >
                  -
                </button>
                <button 
                  type="button" 
                  className="number-control increment"
                  onClick={() => handleNumberChange('passengers', true)}
                  disabled={formData.passengers >= config.booking.maxPassengers}
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="luggage">Bagages</label>
              <div className="number-input-container">
                <input
                  type="number"
                  id="luggage"
                  name="luggage"
                  value={formData.luggage}
                  onChange={handleChange}
                  className="form-control number-input"
                  min="0"
                  max={config.booking.maxLuggage}
                  readOnly
                />
                <button 
                  type="button" 
                  className="number-control decrement"
                  onClick={() => handleNumberChange('luggage', false)}
                  disabled={formData.luggage <= 0}
                >
                  -
                </button>
                <button 
                  type="button" 
                  className="number-control increment"
                  onClick={() => handleNumberChange('luggage', true)}
                  disabled={formData.luggage >= config.booking.maxLuggage}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          
          <div className="form-group vehicle-selection">
            <label>Type de véhicule</label>
            <div className="vehicle-options">
              {config.vehicles.types.map(vehicle => (
                <div 
                  key={vehicle.id}
                  className={`vehicle-option ${formData.vehicleType === vehicle.id ? 'active' : ''}`}
                  onClick={() => handleVehicleSelect(vehicle.id)}
                >
                  <div className="vehicle-icon">
                    {vehicle.id === 'berline' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                        <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                        <path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6"></path>
                        <path d="M5 11l12 0"></path>
                      </svg>
                    )}
                    {vehicle.id === 'electrique' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11.5 20h-6.5v-6a2 2 0 0 1 2 -2h8"></path>
                        <path d="M16 14a2 2 0 1 1 4 0v6h-4v-6z"></path>
                        <path d="M9 4l1 2h6l1 -2"></path>
                        <path d="M12 14h-6v-4"></path>
                        <path d="M15 4m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                        <path d="M19 4m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                      </svg>
                    )}
                    {vehicle.id === 'van' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                        <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                        <path d="M3 17h1v-6h13v6h1"></path>
                        <path d="M3 9l0 -4l8 0l9 4l0 8"></path>
                      </svg>
                    )}
                  </div>
                  <span className="vehicle-name">{vehicle.name}</span>
                  <span className="vehicle-capacity">{vehicle.capacity.passengers} passagers max</span>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            type="submit" 
            className="simulator-button"
            disabled={isLoading}
          >
            {isLoading ? 'Calcul en cours...' : 'Simuler ma course'}
            <ArrowRight size={20} />
          </button>
        </form>
      ) : (
        <div className="simulator-result">
          {/* Le contenu du résultat de simulation serait ici */}
          <button
            onClick={handleBackToForm}
            className="simulator-button"
          >
            Retour à la simulation
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingSimulator;