import React, { createContext, useContext, useState } from 'react';
import config from '../config';
import { isAirportTransfer, isStationTransfer, isNightFare, calculatePrice, calculateDistanceMatrix, simulateDistance } from '../utils/pricing';
import { generateBookingReference } from '../utils/bookingHelpers';

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
    vehicleType: 'berline',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    notes: ''
  });
  
  // État pour les résultats d'estimation
  const [estimationResults, setEstimationResults] = useState({
    distance: 0,
    duration: 0,
    price: 0,
    isAirport: false,
    isStation: false,
    isNightFare: false,
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
    // Vérifier si le formulaire est valide
    if (!validateBookingForm()) {
      return false;
    }
    
    try {
      console.log('Début du calcul d\'estimation...');
      
      // Calculer la distance et la durée avec Google Maps API
      let distanceResult;
      try {
        console.log('Tentative de calcul avec Google Distance Matrix');
        distanceResult = await calculateDistanceMatrix(
          bookingData.pickupAddress,
          bookingData.destinationAddress
        );
        console.log('Résultat Distance Matrix:', distanceResult);
      } catch (error) {
        console.error('Erreur avec Google Distance Matrix:', error);
        console.warn('Utilisation du calcul simulé');
        distanceResult = simulateDistance(
          bookingData.pickupAddress,
          bookingData.destinationAddress
        );
      }
      
      const { distance, duration } = distanceResult;
      
      // Vérifier si c'est un trajet aéroport
      const isAirport = isAirportTransfer(
        bookingData.pickupAddress,
        bookingData.destinationAddress
      );
      
      // Vérifier si c'est un trajet gare
      const isStation = isStationTransfer(
        bookingData.pickupAddress,
        bookingData.destinationAddress
      );
      
      // Vérifier si c'est un tarif de nuit
      const isNight = isNightFare(bookingData.pickupTime);
      
      // Calculer le prix
      const price = calculatePrice({
        distance,
        duration,
        vehicleType: bookingData.vehicleType,
        isAirport,
        isStation,
        isNightFare: isNight
      });
      
      // Générer un numéro de réservation unique
      const bookingRef = generateBookingReference();
      
      console.log('Estimation calculée:', {
        distance: parseFloat(distance.toFixed(1)),
        duration: Math.round(duration),
        price,
        isAirport,
        isStation,
        isNightFare: isNight,
        bookingRef
      });
      
      // Mettre à jour les résultats d'estimation
      setEstimationResults({
        distance: parseFloat(distance.toFixed(1)),
        duration: Math.round(duration),
        price,
        isAirport,
        isStation,
        isNightFare: isNight,
        bookingRef
      });
      
      // Passer à l'étape d'estimation
      setBookingStep('estimation');
      
      return true;
    } catch (error) {
      console.error('Erreur lors du calcul de l\'estimation:', error);
      alert('Une erreur est survenue lors du calcul de l\'estimation. Veuillez réessayer.');
      return false;
    }
  };
  
  // Confirmation de la réservation
  const confirmBooking = async () => {
    try {
      // Vérifier si toutes les informations client sont disponibles
      if (!bookingData.customerName || !bookingData.customerPhone || !bookingData.customerEmail) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return false;
      }
      
      // En production, ici vous feriez un appel API pour créer la réservation
      // Pour l'exemple, on simule une confirmation réussie
      
      // Passer à l'étape de confirmation
      setBookingStep('confirmation');
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la confirmation de la réservation:', error);
      alert('Une erreur est survenue lors de la confirmation de la réservation. Veuillez réessayer.');
      return false;
    }
  };
  
  // Simulation d'estimation (pour le widget de simulation sur la page d'accueil)
  const simulateEstimation = async (simulationData) => {
    try {
      // Calculer la distance et la durée (en production, utiliser l'API Distance Matrix)
      const { distance, duration } = simulateDistance(
        simulationData.pickupAddress,
        simulationData.destinationAddress
      );
      
      // Vérifier si c'est un trajet aéroport
      const isAirport = isAirportTransfer(
        simulationData.pickupAddress,
        simulationData.destinationAddress
      );
      
      // Vérifier si c'est un trajet gare
      const isStation = isStationTransfer(
        simulationData.pickupAddress,
        simulationData.destinationAddress
      );
      
      // Vérifier si c'est un tarif de nuit
      const isNight = isNightFare(simulationData.pickupTime);
      
      // Calculer le prix
      const price = calculatePrice({
        distance,
        duration,
        vehicleType: simulationData.vehicleType,
        isAirport,
        isStation,
        isNightFare: isNight
      });
      
      return {
        distance: parseFloat(distance.toFixed(1)),
        duration: Math.round(duration),
        price,
        isAirport,
        isStation,
        isNightFare: isNight
      };
    } catch (error) {
      console.error('Erreur lors de la simulation:', error);
      throw error;
    }
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
      vehicleType: 'berline',
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      notes: ''
    });
    
    // Réinitialiser les résultats
    setEstimationResults({
      distance: 0,
      duration: 0,
      price: 0,
      isAirport: false,
      isStation: false,
      isNightFare: false,
      bookingRef: ''
    });
    
    // Revenir à l'étape du formulaire
    setBookingStep('form');
  };
  
  // Forme simplifiée du formulaire (pour la page d'accueil)
  const [isSimpleForm, setIsSimpleForm] = useState(true);
  
  // Initialiser les données de réservation à partir de l'état externe (par exemple, de la simulation)
  const initializeFromState = (state) => {
    if (state && state.formData && state.simulationResult) {
      setBookingData({
        ...bookingData,
        ...state.formData
      });
      
      setEstimationResults({
        ...estimationResults,
        ...state.simulationResult,
        bookingRef: generateBookingReference()
      });
      
      // Passer directement à l'étape d'estimation
      setBookingStep('estimation');
      
      return true;
    }
    
    return false;
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
      setIsSimpleForm,
      simulateEstimation,
      initializeFromState
    }}>
      {children}
    </BookingContext.Provider>
  );
};