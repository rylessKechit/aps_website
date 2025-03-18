import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Users, Briefcase } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useBooking } from '../../context/BookingContext';
import VehicleSelector from './VehicleSelector';
import GooglePlacesAutocomplete from './GooglePlacesAutocomplete';
import config from '../../config';

const BookingForm = ({ isSimple = true, onCompleteBooking }) => {
  const { 
    bookingData, 
    updateBookingData, 
    calculateEstimation, 
    validateBookingForm 
  } = useBooking();

  // État local pour traiter les entrées du formulaire avant de mettre à jour le contexte
  const [formData, setFormData] = useState({
    pickupDate: new Date(),
    pickupTime: new Date(new Date().setHours(new Date().getHours() + 1, 0, 0, 0)),
    pickupAddress: '',
    destinationAddress: '',
    passengers: 1,
    luggage: 0,
    vehicleType: 'berline'
  });

  // Synchroniser l'état local avec les données du contexte
  useEffect(() => {
    setFormData({
      pickupDate: bookingData.pickupDate ? new Date(bookingData.pickupDate) : new Date(),
      pickupTime: bookingData.pickupTime ? new Date(bookingData.pickupTime) : new Date(new Date().setHours(new Date().getHours() + 1, 0, 0, 0)),
      pickupAddress: bookingData.pickupAddress || '',
      destinationAddress: bookingData.destinationAddress || '',
      passengers: bookingData.passengers || 1,
      luggage: bookingData.luggage || 0,
      vehicleType: bookingData.vehicleType || 'berline'
    });
  }, [bookingData]);

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

  // Soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Créer une date complète pour l'API (combinaison de date et heure)
    const pickupDateTime = new Date(formData.pickupDate);
    pickupDateTime.setHours(
      formData.pickupTime.getHours(),
      formData.pickupTime.getMinutes(),
      0,
      0
    );
    
    // Mettre à jour les données du contexte
    updateBookingData({
      ...formData,
      pickupDateTime
    });
    
    // Valider le formulaire
    if (validateBookingForm()) {
      if (isSimple) {
        // Si c'est le formulaire simple sur la page d'accueil, 
        // rediriger vers la page de réservation complète
        onCompleteBooking();
      } else {
        // Sinon, calculer l'estimation
        calculateEstimation();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="pickupDate">Date</label>
          <div className="address-input-wrapper">
            <Calendar size={18} className="address-input-icon" />
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
          <div className="address-input-wrapper">
            <Clock size={18} className="address-input-icon" />
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
          placeholder="N° rue, communes..."
          label="Adresse de départ"
          required
        />
      </div>
      
      <div className="form-group">
        <GooglePlacesAutocomplete
          id="destinationAddress"
          name="destinationAddress"
          value={formData.destinationAddress}
          onChange={handleChange}
          placeholder="N° rue, communes..."
          label="Destination"
          required
        />
      </div>
      
      {!isSimple && (
        <>
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
            <VehicleSelector 
              selected={formData.vehicleType} 
              onChange={handleVehicleSelect} 
            />
          </div>
        </>
      )}
      
      <button type="submit" className="btn btn-primary btn-block">
        {isSimple ? "Réserver maintenant" : "Calculer estimation"}
      </button>
    </form>
  );
};

export default BookingForm;