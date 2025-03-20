import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Calendar, Clock, ArrowLeft, Users, Briefcase, Car, Zap, Truck } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { calculateDistanceMatrix, loadGoogleMapsScript } from '../../utils/mapsHelper';
import { isAirportTransfer, isNightFare, calculatePrice, formatPrice, formatDistance, formatDuration } from '../../utils/pricing';
import GooglePlacesAutocomplete from './GooglePlacesAutocomplete';
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
    isNightFare: false,
    distanceText: '',
    durationText: ''
  });
  
  // État pour le chargement
  const [isLoading, setIsLoading] = useState(false);
  
  // État pour le chargement de l'API
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  
  // Charger l'API Google Maps au montage du composant
  useEffect(() => {
    const initApi = async () => {
      try {
        await loadGoogleMapsScript();
        setIsApiLoaded(true);
        console.log('Google Maps API chargée avec succès');
      } catch (error) {
        console.error('Erreur lors du chargement de Google Maps API:', error);
      }
    };
    
    initApi();
  }, []);
  
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
  
  // Simuler la réservation en utilisant l'API Google Maps
  const simulateBooking = async (e) => {
    e.preventDefault();
    
    // Vérifier que les champs sont remplis
    if (!formData.pickupAddress || !formData.destinationAddress) {
      alert('Veuillez renseigner les adresses de départ et de destination.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Début de la simulation avec adresses:', {
        origin: formData.pickupAddress,
        destination: formData.destinationAddress
      });
      
      // Calculer pour l'heure de départ spécifiée
      const departureDateTime = new Date(formData.pickupDate);
      departureDateTime.setHours(
        formData.pickupTime.getHours(),
        formData.pickupTime.getMinutes(),
        0, 0
      );
      
      // Utiliser l'API Distance Matrix pour le calcul réel de distance avec trafic
      let distanceResult;
      try {
        console.log('Tentative de calcul avec Google Distance Matrix pour', departureDateTime.toLocaleString());
        distanceResult = await calculateDistanceMatrix(
          formData.pickupAddress,
          formData.destinationAddress,
          departureDateTime
        );
        console.log('Résultat Distance Matrix avec trafic:', distanceResult);
      } catch (error) {
        console.error('Erreur lors du calcul de distance avec Google Maps API:', error);
        alert('Erreur lors du calcul de distance. Utilisation d\'une estimation approximative.');
        // On utilise une estimation approximative en cas d'erreur
        distanceResult = {
          distance: Math.random() * (25 - 5) + 5, // 5-25 km 
          duration: Math.random() * (40 - 10) + 10, // 10-40 minutes
          distanceText: "15.0 km", // Valeurs par défaut
          durationText: "20 min"
        };
      }
      
      const { distance, duration, distanceText, durationText } = distanceResult;
      
      // Déterminer si c'est un trajet aéroport
      const isAirport = isAirportTransfer(
        formData.pickupAddress,
        formData.destinationAddress
      );
      
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
      
      console.log('Simulation terminée:', {
        distance,
        duration,
        price,
        isAirport,
        isNight,
        distanceText,
        durationText
      });
      
      // Mettre à jour les résultats
      setSimulationResult({
        distance: parseFloat(distance.toFixed(1)),
        duration: Math.round(duration),
        price,
        isAirport,
        isNightFare: isNight,
        distanceText,
        durationText
      });
      
      // Afficher les résultats
      setShowResult(true);
      
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
  
  // Trouver le nom du véhicule
  const getVehicleName = (vehicleId) => {
    const vehicle = config.vehicles.types.find(v => v.id === vehicleId);
    return vehicle ? vehicle.name : vehicleId;
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
                    {vehicle.id === 'berline' && <Car size={24} />}
                    {vehicle.id === 'electrique' && <Zap size={24} />}
                    {vehicle.id === 'van' && <Truck size={24} />}
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
          <div className="result-header">
            <button 
              className="back-button"
              onClick={handleBackToForm}
            >
              <ArrowLeft size={16} />
              <span>Retour</span>
            </button>
            <h3>Résultat de simulation</h3>
          </div>
          
          <div className="result-details">
            <div className="detail-row">
              <div className="detail-label">
                <MapPin size={18} />
                <span>Départ</span>
              </div>
              <div className="detail-value" title={formData.pickupAddress}>
                {formData.pickupAddress}
              </div>
            </div>
            
            <div className="detail-row">
              <div className="detail-label">
                <MapPin size={18} />
                <span>Destination</span>
              </div>
              <div className="detail-value" title={formData.destinationAddress}>
                {formData.destinationAddress}
              </div>
            </div>
            
            <div className="detail-row">
              <div className="detail-label">
                <Calendar size={18} />
                <span>Date</span>
              </div>
              <div className="detail-value">
                {formData.pickupDate.toLocaleDateString('fr-FR')}
              </div>
            </div>
            
            <div className="detail-row">
              <div className="detail-label">
                <Clock size={18} />
                <span>Heure</span>
              </div>
              <div className="detail-value">
                {formData.pickupTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            
            <div className="detail-row">
              <div className="detail-label">
                <Users size={18} />
                <span>Passagers</span>
              </div>
              <div className="detail-value">{formData.passengers}</div>
            </div>
            
            <div className="detail-row">
              <div className="detail-label">
                <Briefcase size={18} />
                <span>Bagages</span>
              </div>
              <div className="detail-value">{formData.luggage}</div>
            </div>
            
            <div className="detail-row">
              <div className="detail-label">
                <Car size={18} />
                <span>Véhicule</span>
              </div>
              <div className="detail-value">{getVehicleName(formData.vehicleType)}</div>
            </div>
          </div>
          
          <div className="result-summary">
            <div className="summary-row">
              <span>Distance estimée</span>
              <span>{simulationResult.distanceText || formatDistance(simulationResult.distance)}</span>
            </div>
            <div className="summary-row">
              <span>Durée estimée</span>
              <span>{simulationResult.durationText || formatDuration(simulationResult.duration)}</span>
            </div>
            {simulationResult.isAirport && (
              <div className="summary-row">
                <span>Supplément aéroport</span>
                <span>{formatPrice(config.pricing.airportSupplement)}</span>
              </div>
            )}
            {simulationResult.isNightFare && (
              <div className="summary-row">
                <span>Supplément de nuit</span>
                <span>{formatPrice(config.pricing.nightSupplement)}</span>
              </div>
            )}
            <div className="summary-row total">
              <span>Prix estimé</span>
              <span>{formatPrice(simulationResult.price)}</span>
            </div>
          </div>
          
          <div className="simulator-actions">
            <button 
              onClick={handleProceedToBooking}
              className="simulator-button"
            >
              Réserver maintenant
              <ArrowRight size={20} />
            </button>
            <button
              onClick={handleBackToForm}
              className="btn btn-outline btn-block"
            >
              Modifier ma demande
            </button>
          </div>
          
          <p className="simulator-note">
            Cette estimation prend en compte les conditions de circulation actuelles. Le temps de trajet et le prix peuvent varier selon le trafic.
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingSimulator;