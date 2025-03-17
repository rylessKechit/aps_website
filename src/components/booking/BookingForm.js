import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Calendar, Users, Briefcase } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useBooking } from '../../context/BookingContext';
import VehicleSelector from './VehicleSelector';
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
        <label htmlFor="pickupAddress">Adresse de départ</label>
        <div className="input-icon-wrapper">
          <MapPin size={18} className="input-icon" />
          <input
            type="text"
            id="pickupAddress"
            name="pickupAddress"
            value={formData.pickupAddress}
            onChange={handleChange}
            placeholder="N° rue, communes..."
            className="form-control"
          />
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="destinationAddress">Destination</label>
        <div className="input-icon-wrapper">
          <MapPin size={18} className="input-icon" />
          <input
            type="text"
            id="destinationAddress"
            name="destinationAddress"
            value={formData.destinationAddress}
            onChange={handleChange}
            placeholder="N° rue, communes..."
            className="form-control"
          />
        </div>
      </div>
      
      {!isSimple && (
        <>
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
                <Briefcase size={18} className="input-icon" />
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
        </>
      )}
      
      <button type="submit" className="btn btn-primary btn-block">
        {isSimple ? "Réserver maintenant" : "Calculer estimation"}
      </button>
    </form>
  );
};

export default BookingForm;