import config from '../config';

/**
 * Vérifie si une adresse contient des mots-clés d'aéroport
 * @param {string} address - Adresse à vérifier
 * @returns {boolean} - True si l'adresse contient un mot-clé d'aéroport
 */
export const isAirportAddress = (address) => {
  if (!address) return false;
  
  address = address.toLowerCase();
  return config.booking.airportKeywords.some(keyword => address.includes(keyword));
};

/**
 * Génère un numéro de référence de réservation unique
 * @returns {string} - Numéro de référence au format APS-XXXXXX
 */
export const generateBookingReference = () => {
  const prefix = 'APS';
  const timestamp = new Date().getTime().toString().slice(-6);
  const randomChars = Math.random().toString(36).substring(2, 5).toUpperCase();
  
  return `${prefix}-${timestamp}${randomChars}`;
};

/**
 * Calcule un prix estimé basé sur différents paramètres
 * @param {Object} params - Paramètres pour le calcul
 * @param {number} params.distance - Distance en km
 * @param {number} params.duration - Durée en minutes
 * @param {string} params.vehicleType - Type de véhicule (berline, electrique, van)
 * @param {boolean} params.isAirport - S'il s'agit d'un trajet aéroport
 * @param {number} params.hour - Heure de prise en charge (0-23)
 * @returns {number} - Prix estimé en euros
 */
export const calculatePrice = ({
  distance,
  duration,
  vehicleType = 'berline',
  isAirport = false,
  hour = new Date().getHours()
}) => {
  // Prix de base
  let price = config.pricing.baseFare + (distance * config.pricing.pricePerKm[vehicleType]);
  
  // Supplément aéroport
  if (isAirport) {
    price += config.pricing.airportSupplement;
  }
  
  // Supplément nuit
  if (hour >= config.pricing.nightHours.start || hour < config.pricing.nightHours.end) {
    price += config.pricing.nightSupplement;
  }
  
  // Tarif minimum
  if (price < config.pricing.minimumFare[vehicleType]) {
    price = config.pricing.minimumFare[vehicleType];
  }
  
  return parseFloat(price.toFixed(2));
};

/**
 * Vérifie la disponibilité des chauffeurs pour une date et heure donnée
 * @param {Date} dateTime - Date et heure de la réservation
 * @returns {Promise<boolean>} - True si des chauffeurs sont disponibles
 */
export const checkDriverAvailability = async (dateTime) => {
  // Dans une application réelle, vous interrogeriez votre API
  // Pour cet exemple, nous simulons une vérification
  
  // Générer une disponibilité aléatoire avec 90% de chance d'être disponible
  const isAvailable = Math.random() < 0.9;
  
  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return isAvailable;
};

/**
 * Formate les données de réservation pour l'API
 * @param {Object} bookingData - Données du formulaire de réservation
 * @returns {Object} - Données formatées pour l'API
 */
export const formatBookingData = (bookingData) => {
  // Créer une date complète pour l'API
  const pickupDateTime = new Date(bookingData.pickupDate);
  
  if (bookingData.pickupTime) {
    pickupDateTime.setHours(
      bookingData.pickupTime.getHours(),
      bookingData.pickupTime.getMinutes(),
      0,
      0
    );
  }
  
  return {
    pickupDateTime: pickupDateTime.toISOString(),
    pickupAddress: bookingData.pickupAddress,
    destinationAddress: bookingData.destinationAddress,
    passengers: bookingData.passengers,
    luggage: bookingData.luggage,
    vehicleType: bookingData.vehicleType,
    isAirport: isAirportAddress(bookingData.pickupAddress) || isAirportAddress(bookingData.destinationAddress),
    customerName: bookingData.customerName,
    customerPhone: bookingData.customerPhone,
    customerEmail: bookingData.customerEmail,
    notes: bookingData.notes
  };
};

/**
 * Envoie les données de réservation à l'API
 * @param {Object} bookingData - Données du formulaire de réservation
 * @returns {Promise<Object>} - Réponse de l'API
 */
export const submitBooking = async (bookingData) => {
  // Dans une application réelle, vous feriez un appel API
  // Pour cet exemple, on simule une réponse
  
  // Formater les données
  const formattedData = formatBookingData(bookingData);
  
  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simuler une réponse API
  return {
    success: true,
    bookingId: generateBookingReference(),
    estimatedPrice: calculatePrice({
      distance: 25,
      duration: 40,
      vehicleType: bookingData.vehicleType,
      isAirport: formattedData.isAirport,
      hour: new Date(formattedData.pickupDateTime).getHours()
    })
  };
};