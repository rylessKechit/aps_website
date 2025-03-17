/**
 * Fonctions utilitaires pour la validation de formulaires
 */
import * as Yup from 'yup';
import config from '../config';

/**
 * Schéma de validation pour le formulaire de réservation
 */
export const bookingValidationSchema = Yup.object({
  pickupAddress: Yup.string()
    .required('L\'adresse de départ est requise')
    .min(5, 'L\'adresse de départ doit contenir au moins 5 caractères'),
  
  destinationAddress: Yup.string()
    .required('L\'adresse de destination est requise')
    .min(5, 'L\'adresse de destination doit contenir au moins 5 caractères')
    .test(
      'not-same-as-pickup',
      'L\'adresse de destination ne peut pas être identique à l\'adresse de départ',
      function(value) {
        return this.parent.pickupAddress !== value;
      }
    ),
  
  pickupDateTime: Yup.date()
    .required('La date et l\'heure de départ sont requises')
    .test(
      'is-future',
      `La réservation doit être effectuée au moins ${config.booking.minAdvanceTime} minutes à l'avance`,
      function(value) {
        if (!value) return false;
        const minTime = new Date();
        minTime.setMinutes(minTime.getMinutes() + config.booking.minAdvanceTime);
        return value >= minTime;
      }
    ),
  
  passengers: Yup.number()
    .required('Le nombre de passagers est requis')
    .min(1, 'Au moins 1 passager est requis')
    .max(config.booking.maxPassengers, `Maximum ${config.booking.maxPassengers} passagers autorisés`),
  
  luggage: Yup.number()
    .required('Le nombre de bagages est requis')
    .min(0, 'Le nombre de bagages ne peut pas être négatif')
    .max(config.booking.maxLuggage, `Maximum ${config.booking.maxLuggage} bagages autorisés`),
  
  vehicleType: Yup.string()
    .required('Le type de véhicule est requis')
    .oneOf(
      config.vehicles.types.map(v => v.id),
      'Type de véhicule invalide'
    ),
  
  // Champs facultatifs pour une réservation complète
  customerName: Yup.string()
    .when('$isComplete', {
      is: true,
      then: Yup.string().required('Votre nom est requis').min(2, 'Votre nom doit contenir au moins 2 caractères')
    }),
  
  customerPhone: Yup.string()
    .when('$isComplete', {
      is: true,
      then: Yup.string()
        .required('Votre numéro de téléphone est requis')
        .matches(/^[+\d\s()-]{10,20}$/, 'Numéro de téléphone invalide')
    }),
  
  customerEmail: Yup.string()
    .when('$isComplete', {
      is: true,
      then: Yup.string()
        .required('Votre email est requis')
        .email('Email invalide')
    }),
  
  notes: Yup.string()
    .max(500, 'Les notes ne peuvent pas dépasser 500 caractères')
});

/**
 * Schéma de validation pour le formulaire de contact
 */
export const contactValidationSchema = Yup.object({
  name: Yup.string()
    .required('Votre nom est requis')
    .min(2, 'Votre nom doit contenir au moins 2 caractères'),
  
  email: Yup.string()
    .required('Votre email est requis')
    .email('Email invalide'),
  
  phone: Yup.string()
    .matches(/^[+\d\s()-]{10,20}$/, 'Numéro de téléphone invalide')
    .nullable(),
  
  subject: Yup.string(),
  
  message: Yup.string()
    .required('Votre message est requis')
    .min(10, 'Votre message doit contenir au moins 10 caractères')
    .max(1000, 'Votre message ne peut pas dépasser 1000 caractères')
});

/**
 * Validation d'un email
 * @param {string} email - Email à valider
 * @returns {boolean} - True si l'email est valide
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validation d'un numéro de téléphone
 * @param {string} phone - Numéro de téléphone à valider
 * @returns {boolean} - True si le numéro est valide
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[+\d\s()-]{10,20}$/;
  return phoneRegex.test(phone);
};

/**
 * Validation d'une date future
 * @param {Date} date - Date à valider
 * @param {number} minMinutes - Minutes minimum dans le futur
 * @returns {boolean} - True si la date est suffisamment dans le futur
 */
export const isValidFutureDate = (date, minMinutes = config.booking.minAdvanceTime) => {
  if (!date) return false;
  
  const minTime = new Date();
  minTime.setMinutes(minTime.getMinutes() + minMinutes);
  
  return date >= minTime;
};

/**
 * Validation d'une adresse
 * @param {string} address - Adresse à valider
 * @returns {boolean} - True si l'adresse est valide
 */
export const isValidAddress = (address) => {
  if (!address || address.trim().length < 5) return false;
  
  // Vérification simple : l'adresse doit contenir au moins une lettre et un chiffre
  return /[a-zA-Z]/.test(address) && /\d/.test(address);
};

/**
 * Validation des données de réservation
 * @param {Object} data - Données à valider
 * @param {boolean} isComplete - Si la validation est pour une réservation complète
 * @returns {Object} - Résultat de la validation {isValid, errors}
 */
export const validateBookingData = (data, isComplete = false) => {
  try {
    // Validation avec Yup
    bookingValidationSchema.validateSync(data, { 
      abortEarly: false,
      context: { isComplete }
    });
    
    return { isValid: true, errors: {} };
  } catch (err) {
    // Récupérer les erreurs
    const errors = {};
    
    if (err.inner) {
      err.inner.forEach(error => {
        errors[error.path] = error.message;
      });
    }
    
    return { isValid: false, errors };
  }
};

/**
 * Validation des données de contact
 * @param {Object} data - Données à valider
 * @returns {Object} - Résultat de la validation {isValid, errors}
 */
export const validateContactData = (data) => {
  try {
    // Validation avec Yup
    contactValidationSchema.validateSync(data, { abortEarly: false });
    
    return { isValid: true, errors: {} };
  } catch (err) {
    // Récupérer les erreurs
    const errors = {};
    
    if (err.inner) {
      err.inner.forEach(error => {
        errors[error.path] = error.message;
      });
    }
    
    return { isValid: false, errors };
  }
};