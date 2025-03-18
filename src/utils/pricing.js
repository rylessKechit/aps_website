/**
 * Fonctions utilitaires pour le calcul des prix et estimations
 */
import config from '../config';

/**
 * Simule la distance entre deux points (fallback si Google Maps API échoue)
 * @param {string} origin - Adresse de départ
 * @param {string} destination - Adresse d'arrivée
 * @returns {Object} - Distance et durée estimées
 */
export const simulateDistance = (origin, destination) => {
  // Vérifier si c'est un trajet aéroport
  const isAirport = isAirportTransfer(origin, destination);
  
  // Vérifier si c'est un trajet gare
  const isStation = isStationTransfer(origin, destination);
  
  // Simuler une distance en fonction du type de trajet
  if (isAirport) {
    return {
      distance: Math.random() * (40 - 25) + 25, // 25-40 km pour un aéroport
      duration: Math.random() * (60 - 30) + 30, // 30-60 minutes
    };
  } else if (isStation) {
    return {
      distance: Math.random() * (25 - 12) + 12, // 12-25 km pour une gare
      duration: Math.random() * (40 - 20) + 20, // 20-40 minutes
    };
  } else {
    return {
      distance: Math.random() * (25 - 5) + 5, // 5-25 km pour un trajet local
      duration: Math.random() * (40 - 10) + 10, // 10-40 minutes
    };
  }
};

/**
 * Vérifie si un trajet inclut une adresse d'aéroport
 * @param {string} pickupAddress - Adresse de départ
 * @param {string} destinationAddress - Adresse de destination
 * @returns {boolean} - True si une adresse contient un mot-clé d'aéroport
 */
export const isAirportTransfer = (pickupAddress, destinationAddress) => {
  if (!pickupAddress && !destinationAddress) return false;
  
  const addresses = [
    pickupAddress ? pickupAddress.toLowerCase() : '',
    destinationAddress ? destinationAddress.toLowerCase() : ''
  ];
  
  return config.booking.airportKeywords.some(keyword => 
    addresses.some(address => address.includes(keyword))
  );
};

/**
 * Vérifie si un trajet inclut une adresse de gare
 * @param {string} pickupAddress - Adresse de départ
 * @param {string} destinationAddress - Adresse de destination
 * @returns {boolean} - True si une adresse contient un mot-clé de gare
 */
export const isStationTransfer = (pickupAddress, destinationAddress) => {
  if (!pickupAddress && !destinationAddress) return false;
  
  const addresses = [
    pickupAddress ? pickupAddress.toLowerCase() : '',
    destinationAddress ? destinationAddress.toLowerCase() : ''
  ];
  
  // Mots-clés pour les gares
  const stationKeywords = ['gare', 'station', 'tgv', 'ter', 'sncf'];
  
  return stationKeywords.some(keyword => 
    addresses.some(address => address.includes(keyword))
  );
};

/**
 * Vérifie si un trajet se fait en tarif de nuit
 * @param {Date|string} dateTime - Date et heure du trajet
 * @returns {boolean} - True si le trajet est en tarif de nuit
 */
export const isNightFare = (dateTime) => {
  if (!dateTime) return false;
  
  const date = new Date(dateTime);
  const hour = date.getHours();
  
  return hour >= config.pricing.nightHours.start || hour < config.pricing.nightHours.end;
};

/**
 * Calcule le prix d'un trajet
 * @param {Object} params - Paramètres pour le calcul
 * @param {number} params.distance - Distance en km
 * @param {number} params.duration - Durée en minutes (optionnel)
 * @param {string} params.vehicleType - Type de véhicule
 * @param {boolean} params.isAirport - Si c'est un trajet aéroport
 * @param {boolean} params.isStation - Si c'est un trajet gare
 * @param {boolean} params.isNightFare - Si c'est un tarif de nuit
 * @param {number} params.waitingTime - Temps d'attente en minutes (optionnel)
 * @returns {number} - Prix estimé en euros
 */
export const calculatePrice = ({
  distance,
  duration,
  vehicleType = 'berline',
  isAirport = false,
  isStation = false,
  isNightFare = false,
  waitingTime = 0
}) => {
  // Vérifier si les paramètres sont valides
  if (!distance || distance <= 0 || !vehicleType) {
    console.error('Paramètres invalides pour le calcul du prix');
    return 0;
  }
  
  // Vérifier si le type de véhicule est valide
  if (!config.pricing.pricePerKm[vehicleType]) {
    console.error(`Type de véhicule invalide: ${vehicleType}`);
    vehicleType = 'berline'; // Type par défaut
  }
  
  // Prix de base + tarification au km
  let price = config.pricing.baseFare + (distance * config.pricing.pricePerKm[vehicleType]);
  
  // Supplément aéroport
  if (isAirport) {
    price += config.pricing.airportSupplement;
  }
  
  // Supplément gare
  if (isStation && !isAirport) { // Éviter de doubler les suppléments
    price += config.pricing.stationSupplement || 5; // Ajouter un supplément gare par défaut si non défini
  }
  
  // Supplément nuit
  if (isNightFare) {
    price += config.pricing.nightSupplement;
  }
  
  // Temps d'attente (par tranches de 15 minutes)
  if (waitingTime > 0) {
    const waitingHours = waitingTime / 60;
    price += waitingHours * config.pricing.waitingPricePerHour;
  }
  
  // Appliquer le tarif minimum
  const minFare = config.pricing.minimumFare[vehicleType];
  if (price < minFare) {
    price = minFare;
  }
  
  // Arrondir à 2 décimales
  return parseFloat(price.toFixed(2));
};

/**
 * Calcule la distance et la durée entre deux adresses à l'aide de Google Maps API
 * @param {string} origin - Adresse de départ
 * @param {string} destination - Adresse de destination
 * @returns {Promise<Object>} - Distance et durée estimées
 */
export const calculateDistanceMatrix = async (origin, destination) => {
  try {
    if (!window.google || !window.google.maps) {
      throw new Error('Google Maps API non chargée');
    }
    
    const service = new window.google.maps.DistanceMatrixService();
    
    const result = await new Promise((resolve, reject) => {
      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false,
        },
        (response, status) => {
          if (status === 'OK') {
            resolve(response);
          } else {
            reject(new Error(`Erreur Distance Matrix: ${status}`));
          }
        }
      );
    });
    
    const row = result.rows[0];
    const element = row.elements[0];
    
    if (element.status === 'OK') {
      return {
        distance: element.distance.value / 1000, // Convertir en km
        duration: element.duration.value / 60,   // Convertir en minutes
      };
    } else {
      throw new Error(`Erreur d'itinéraire: ${element.status}`);
    }
  } catch (error) {
    console.error('Erreur lors du calcul de distance:', error);
    
    // Fallback sur la simulation si l'API échoue
    return simulateDistance(origin, destination);
  }
};

/**
 * Calcule les suppléments pour un trajet
 * @param {Object} params - Paramètres pour le calcul
 * @param {boolean} params.isAirport - Si c'est un trajet aéroport
 * @param {boolean} params.isStation - Si c'est un trajet gare
 * @param {boolean} params.isNightFare - Si c'est un tarif de nuit
 * @param {number} params.waitingTime - Temps d'attente en minutes (optionnel)
 * @returns {Object[]} - Liste des suppléments {name, amount}
 */
export const calculateSurcharges = ({
  isAirport = false,
  isStation = false,
  isNightFare = false,
  waitingTime = 0
}) => {
  const surcharges = [];
  
  // Supplément aéroport
  if (isAirport) {
    surcharges.push({
      name: 'Supplément aéroport',
      amount: config.pricing.airportSupplement
    });
  }
  
  // Supplément gare
  if (isStation && !isAirport) { // Éviter de doubler les suppléments
    surcharges.push({
      name: 'Supplément gare',
      amount: config.pricing.stationSupplement || 5
    });
  }
  
  // Supplément nuit
  if (isNightFare) {
    surcharges.push({
      name: 'Supplément nuit (22h-6h)',
      amount: config.pricing.nightSupplement
    });
  }
  
  // Temps d'attente
  if (waitingTime > 0) {
    const waitingHours = waitingTime / 60;
    const waitingCost = waitingHours * config.pricing.waitingPricePerHour;
    
    surcharges.push({
      name: `Temps d'attente (${Math.ceil(waitingTime)} min)`,
      amount: parseFloat(waitingCost.toFixed(2))
    });
  }
  
  return surcharges;
};

/**
 * Calcule une estimation détaillée pour un trajet
 * @param {Object} params - Paramètres pour le calcul
 * @param {number} params.distance - Distance en km
 * @param {number} params.duration - Durée en minutes
 * @param {string} params.vehicleType - Type de véhicule
 * @param {string} params.pickupAddress - Adresse de départ
 * @param {string} params.destinationAddress - Adresse de destination
 * @param {Date|string} params.pickupDateTime - Date et heure du trajet
 * @param {number} params.waitingTime - Temps d'attente en minutes (optionnel)
 * @returns {Object} - Estimation détaillée
 */
export const calculateDetailedEstimation = ({
  distance,
  duration,
  vehicleType = 'berline',
  pickupAddress,
  destinationAddress,
  pickupDateTime,
  waitingTime = 0
}) => {
  // Déterminer si c'est un trajet aéroport
  const isAirport = isAirportTransfer(pickupAddress, destinationAddress);
  
  // Déterminer si c'est un trajet gare
  const isStation = isStationTransfer(pickupAddress, destinationAddress);
  
  // Déterminer si c'est un tarif de nuit
  const isNight = isNightFare(pickupDateTime);
  
  // Calculer le prix de base (distance * tarif au km)
  const baseFare = config.pricing.baseFare;
  const distanceCost = distance * config.pricing.pricePerKm[vehicleType];
  
  // Calculer les suppléments
  const surcharges = calculateSurcharges({
    isAirport,
    isStation,
    isNightFare: isNight,
    waitingTime
  });
  
  // Calculer le prix total
  const totalSurcharges = surcharges.reduce((sum, item) => sum + item.amount, 0);
  let totalPrice = baseFare + distanceCost + totalSurcharges;
  
  // Appliquer le tarif minimum
  const minFare = config.pricing.minimumFare[vehicleType];
  if (totalPrice < minFare) {
    totalPrice = minFare;
  }
  
  // Construire l'estimation détaillée
  return {
    baseFare: {
      name: 'Tarif de base',
      amount: baseFare
    },
    distanceCost: {
      name: `Distance (${distance.toFixed(1)} km)`,
      amount: parseFloat(distanceCost.toFixed(2))
    },
    surcharges,
    minFare: {
      name: 'Tarif minimum',
      amount: minFare,
      applied: totalPrice === minFare
    },
    totalPrice: parseFloat(totalPrice.toFixed(2)),
    estimatedDistance: distance,
    estimatedDuration: duration,
    isAirportTransfer: isAirport,
    isStationTransfer: isStation,
    isNightFare: isNight,
    currency: 'EUR'
  };
};

/**
 * Formate le prix pour l'affichage
 * @param {number} price - Prix à formater
 * @param {string} currency - Devise (EUR par défaut)
 * @returns {string} - Prix formaté
 */
export const formatPrice = (price, currency = 'EUR') => {
  if (isNaN(price)) return '0,00 €';
  
  // Formater le prix avec le séparateur décimal français
  const formattedPrice = price.toFixed(2).replace('.', ',');
  
  // Ajouter le symbole de devise
  if (currency === 'EUR') {
    return `${formattedPrice} €`;
  } else {
    return `${formattedPrice} ${currency}`;
  }
};

/**
 * Formate la distance pour l'affichage
 * @param {number} distance - Distance en km
 * @returns {string} - Distance formatée
 */
export const formatDistance = (distance) => {
  if (isNaN(distance)) return '0 km';
  
  return `${distance.toFixed(1)} km`;
};

/**
 * Formate la durée pour l'affichage
 * @param {number} duration - Durée en minutes
 * @returns {string} - Durée formatée
 */
export const formatDuration = (duration) => {
  if (isNaN(duration)) return '0 min';
  
  // Si la durée est inférieure à 60 minutes
  if (duration < 60) {
    return `${Math.round(duration)} min`;
  }
  
  // Sinon, formater en heures et minutes
  const hours = Math.floor(duration / 60);
  const minutes = Math.round(duration % 60);
  
  if (minutes === 0) {
    return `${hours} h`;
  } else {
    return `${hours} h ${minutes} min`;
  }
};