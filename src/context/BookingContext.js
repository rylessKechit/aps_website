import React, { createContext, useContext, useState } from 'react';
import config from '../config';
import { isAirportAddress, generateBookingReference } from '../utils/bookingHelpers';

// Création du contexte
const BookingContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useBooking = () => useContext(BookingContext);

// Fournisseur du contexte
export const BookingProvider = ({ children }) => {
  // État pour les étapes de réservation
  const [bookingStep, setBookingStep] = useState('form'); // 'form', 'estimation', 'confirmation'
  
  // État pour les données du formulaire
  const [bookingData, setBookingData] = useState({
    pickupDate: new Date(),
    pickupTime: new Date(new Date().setHours(new Date().getHours() + 1, 0, 0, 0)),
    pickupDateTime: null,
    pickupAddress: '',
    destinationAddress: '',
    passengers: 1,
    luggage: 0,
    vehicleType: 'berline'
  });
  
  // État pour les résultats d'estimation
  const [estimationResults, setEstimationResults] = useState({
    distance: 0,
    duration: 0,
    price: 0,
    bookingRef: ''
  });
  
  // Mise à jour des données de réservation
  const updateBookingData = (data) => {
    setBookingData(prevData => ({
      ...prevData,
      ...data
    }));
  };
  
  // Validation du formulaire de réservation
  const validateBookingForm = () => {
    // Vérifier les adresses
    if (!bookingData.pickupAddress.trim() || !bookingData.destinationAddress.trim()) {
      alert('Veuillez renseigner les adresses de départ et de destination.');
      return false;
    }
    
    // Vérifier que les adresses sont différentes
    if (bookingData.pickupAddress === bookingData.destinationAddress) {
      alert('Les adresses de départ et de destination ne peuvent pas être identiques.');
      return false;
    }
    
    // Vérifier la date et l'heure
    const now = new Date();
    const pickupDateTime = new Date(bookingData.pickupDate);
    
    if (bookingData.pickupTime) {
      pickupDateTime.setHours(
        bookingData.pickupTime.getHours(),
        bookingData.pickupTime.getMinutes(),
        0,
        0
      );
    }
    
    // Ajouter 30 minutes pour le délai minimum
    const minTime = new Date(now.getTime() + config.booking.minAdvanceTime * 60000);
    
    if (pickupDateTime < minTime) {
      alert(`La réservation doit être effectuée au moins ${config.booking.minAdvanceTime} minutes à l'avance.`);
      return false;
    }
    
    return true;
  };
  
  // Calcul de l'estimation
  const calculateEstimation = async () => {
    // Ici, vous utiliseriez normalement un service externe comme Google Distance Matrix
    // Pour l'exemple, on simule une estimation
    
    // Vérifier si c'est un trajet aéroport
    const isAirport = isAirportAddress(bookingData.pickupAddress) || 
                      isAirportAddress(bookingData.destinationAddress);
    
    // Générer une distance aléatoire basée sur le type de trajet
    const baseDist = isAirport ? getRandomNumber(25, 40) : getRandomNumber(5, 25);
    
    // Ajustements selon le nombre de passagers et bagages
    const paxAdjustment = bookingData.passengers > 4 ? 1.1 : 1;
    const lugAdjustment = bookingData.luggage > 2 ? 1.05 : 1;
    
    // Calculer la distance finale
    const distance = baseDist * paxAdjustment * lugAdjustment;
    
    // Calculer la durée (vitesse moyenne de 40km/h en trafic urbain)
    const duration = Math.round(distance / 40 * 60);
    
    // Calculer le prix en fonction du type de véhicule
    let price = config.pricing.baseFare + (distance * config.pricing.pricePerKm[bookingData.vehicleType]);
    
    // Ajouter les suppléments
    if (isAirport) {
      price += config.pricing.airportSupplement;
    }
    
    // Vérifier si le tarif de nuit s'applique
    const hour = bookingData.pickupTime.getHours();
    if (hour >= config.pricing.nightHours.start || hour < config.pricing.nightHours.end) {
      price += config.pricing.nightSupplement;
    }
    
    // Appliquer le tarif minimum si le prix calculé est inférieur
    if (price < config.pricing.minimumFare[bookingData.vehicleType]) {
      price = config.pricing.minimumFare[bookingData.vehicleType];
    }
    
    // Mettre à jour les résultats d'estimation
    setEstimationResults({
      distance: parseFloat(distance.toFixed(1)),
      duration: duration,
      price: parseFloat(price.toFixed(2)),
      bookingRef: generateBookingReference()
    });
    
    // Passer à l'étape d'estimation
    setBookingStep('estimation');
    
    return { distance, duration, price };
  };
  
  // Confirmation de la réservation
  const confirmBooking = () => {
    // Ici, vous enverriez normalement les données à votre API
    // Pour l'exemple, on simule une confirmation réussie
    setBookingStep('confirmation');
    return true;
  };
  
  // Nouvelle réservation
  const startNewBooking = () => {
    // Réinitialiser le formulaire
    setBookingData({
      pickupDate: new Date(),
      pickupTime: new Date(new Date().setHours(new Date().getHours() + 1, 0, 0, 0)),
      pickupDateTime: null,
      pickupAddress: '',
      destinationAddress: '',
      passengers: 1,
      luggage: 0,
      vehicleType: 'berline'
    });
    
    // Réinitialiser les résultats
    setEstimationResults({
      distance: 0,
      duration: 0,
      price: 0,
      bookingRef: ''
    });
    
    // Revenir à l'étape du formulaire
    setBookingStep('form');
  };
  
  // Forme simplifiée du formulaire (pour la page d'accueil)
  const [isSimpleForm, setIsSimpleForm] = useState(true);
  
  // Fonctions utilitaires
  const getRandomNumber = (min, max) => {
    return Math.random() * (max - min) + min;
  };
  
  // Fournir le contexte
  return (
    <BookingContext.Provider value={{
      bookingStep,
      setBookingStep,
      bookingData,
      updateBookingData,
      estimationResults,
      validateBookingForm,
      calculateEstimation,
      confirmBooking,
      startNewBooking,
      isSimpleForm,
      setIsSimpleForm
    }}>
      {children}
    </BookingContext.Provider>
  );
};