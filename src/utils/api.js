import axios from 'axios';
import config from '../config';

// Instance Axios avec configuration de base
const api = axios.create({
  baseURL: config.api.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 secondes
});

/**
 * Intercepteur pour les requêtes
 */
api.interceptors.request.use(
  (config) => {
    // Vous pouvez ajouter un token d'authentification ici
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Intercepteur pour les réponses
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Gestion globale des erreurs
    if (error.response) {
      // La requête a été faite et le serveur a répondu avec un code d'état
      // qui se situe en dehors de la plage 2xx
      console.error('Erreur de réponse:', error.response.data);
      
      // Gérer les différents codes d'erreur
      switch (error.response.status) {
        case 401:
          // Non autorisé - déconnexion ou redirection
          // localStorage.removeItem('token');
          // window.location.href = '/login';
          break;
        case 403:
          // Interdit - permissions insuffisantes
          break;
        case 404:
          // Non trouvé
          break;
        case 500:
          // Erreur serveur
          break;
        default:
          // Autres erreurs
          break;
      }
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      console.error('Erreur de requête:', error.request);
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      console.error('Erreur:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API de réservation

/**
 * Calcule une estimation de prix pour un trajet
 * @param {Object} estimationData - Données pour l'estimation
 * @returns {Promise<Object>} - Résultat de l'estimation
 */
export const calculateEstimation = async (estimationData) => {
  try {
    const response = await api.post(config.api.endpoints.estimation, estimationData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors du calcul de l\'estimation', error);
    
    // Pour l'exemple, simuler une réponse
    // À retirer en production
    return simulateEstimation(estimationData);
  }
};

/**
 * Crée une réservation de taxi
 * @param {Object} bookingData - Données de la réservation
 * @returns {Promise<Object>} - Réservation créée
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await api.post(config.api.endpoints.booking, bookingData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la réservation', error);
    
    // Pour l'exemple, simuler une réponse
    // À retirer en production
    return simulateBookingResponse(bookingData);
  }
};

/**
 * Envoie un formulaire de contact
 * @param {Object} contactData - Données du formulaire de contact
 * @returns {Promise<Object>} - Résultat de l'envoi
 */
export const submitContactForm = async (contactData) => {
  try {
    const response = await api.post(config.api.endpoints.contact, contactData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi du formulaire de contact', error);
    
    // Pour l'exemple, simuler une réponse
    // À retirer en production
    return simulateContactResponse(contactData);
  }
};

/**
 * Géocode une adresse en coordonnées
 * @param {string} address - Adresse à géocoder
 * @returns {Promise<Object>} - Coordonnées géographiques
 */
export const geocodeAddress = async (address) => {
  try {
    const response = await api.get(`${config.api.endpoints.geocoding}?address=${encodeURIComponent(address)}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors du géocodage de l\'adresse', error);
    
    // Pour l'exemple, simuler une réponse
    // À retirer en production
    return simulateGeocodingResponse(address);
  }
};

// Fonctions de simulation pour le développement
// À retirer en production

/**
 * Simule une estimation de prix
 * @param {Object} data - Données pour l'estimation
 * @returns {Object} - Estimation simulée
 */
const simulateEstimation = (data) => {
  // Vérifier si c'est un trajet aéroport
  const isAirport = isAirportAddress(data.pickupAddress) || isAirportAddress(data.destinationAddress);
  
  // Générer une distance aléatoire
  const distance = isAirport ? getRandomNumber(25, 40) : getRandomNumber(5, 25);
  
  // Calculer la durée (vitesse moyenne de 40km/h)
  const duration = Math.round(distance / 40 * 60);
  
  // Calculer le prix
  const baseFare = config.pricing.baseFare;
  const pricePerKm = config.pricing.pricePerKm[data.vehicleType || 'berline'];
  let price = baseFare + (distance * pricePerKm);
  
  // Ajouter les suppléments
  if (isAirport) {
    price += config.pricing.airportSupplement;
  }
  
  // Vérifier si tarif de nuit
  const pickupTime = new Date(data.pickupDateTime);
  const hour = pickupTime.getHours();
  if (hour >= config.pricing.nightHours.start || hour < config.pricing.nightHours.end) {
    price += config.pricing.nightSupplement;
  }
  
  // Appliquer le tarif minimum
  const minFare = config.pricing.minimumFare[data.vehicleType || 'berline'];
  if (price < minFare) {
    price = minFare;
  }
  
  // Simuler un délai
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        success: true,
        estimation: {
          distance: parseFloat(distance.toFixed(1)),
          duration,
          price: parseFloat(price.toFixed(2)),
          currency: 'EUR',
          isAirport,
          isNightFare: hour >= config.pricing.nightHours.start || hour < config.pricing.nightHours.end
        }
      });
    }, 500);
  });
};

/**
 * Simule une réponse de réservation
 * @param {Object} data - Données de la réservation
 * @returns {Object} - Réservation simulée
 */
const simulateBookingResponse = (data) => {
  // Générer un identifiant unique
  const bookingId = `APS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Simuler un délai
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        success: true,
        booking: {
          id: bookingId,
          ...data,
          status: 'confirmed',
          createdAt: new Date().toISOString()
        }
      });
    }, 800);
  });
};

/**
 * Simule une réponse de formulaire de contact
 * @param {Object} data - Données du formulaire
 * @returns {Object} - Réponse simulée
 */
const simulateContactResponse = (data) => {
  // Simuler un délai
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Votre message a été envoyé avec succès'
      });
    }, 800);
  });
};

/**
 * Simule une réponse de géocodage
 * @param {string} address - Adresse à géocoder
 * @returns {Object} - Coordonnées simulées
 */
const simulateGeocodingResponse = (address) => {
  // Coordonnées pour des adresses spécifiques
  if (address.toLowerCase().includes('orly')) {
    return {
      lat: 48.7262,
      lng: 2.3652,
      formatted_address: 'Aéroport d\'Orly, 94390 Orly, France'
    };
  } else if (address.toLowerCase().includes('roissy') || address.toLowerCase().includes('cdg')) {
    return {
      lat: 49.0097,
      lng: 2.5479,
      formatted_address: 'Aéroport Charles de Gaulle, 95700 Roissy-en-France, France'
    };
  } else if (address.toLowerCase().includes('massy')) {
    return {
      lat: 48.7253,
      lng: 2.2730,
      formatted_address: 'Massy, 91300, France'
    };
  } else if (address.toLowerCase().includes('paris')) {
    return {
      lat: 48.8566,
      lng: 2.3522,
      formatted_address: 'Paris, France'
    };
  }
  
  // Générer des coordonnées aléatoires autour de l'Essonne
  const lat = config.location.center.lat + (Math.random() - 0.5) * 0.1;
  const lng = config.location.center.lng + (Math.random() - 0.5) * 0.1;
  
  return {
    lat,
    lng,
    formatted_address: `${address}, France`
  };
};

// Fonctions utilitaires

/**
 * Vérifie si une adresse contient des mots-clés d'aéroport
 * @param {string} address - Adresse à vérifier
 * @returns {boolean} - True si l'adresse contient un mot-clé d'aéroport
 */
function isAirportAddress(address) {
  if (!address) return false;
  
  address = address.toLowerCase();
  return config.booking.airportKeywords.some(keyword => address.includes(keyword));
}

/**
 * Génère un nombre aléatoire entre min et max
 * @param {number} min - Valeur minimum
 * @param {number} max - Valeur maximum
 * @returns {number} - Nombre aléatoire
 */
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

export default api;