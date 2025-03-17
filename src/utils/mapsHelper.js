import { geocodeAddress } from './api';
import config from '../config';

/**
 * Charge le script Google Maps de manière asynchrone
 * @returns {Promise} - Promise résolue quand le script est chargé
 */
export const loadGoogleMapsScript = () => {
  return new Promise((resolve, reject) => {
    // Vérifier si le script est déjà chargé
    if (window.google && window.google.maps) {
      resolve(window.google.maps);
      return;
    }
    
    // Callback quand le script est chargé
    window.initGoogleMaps = () => {
      resolve(window.google.maps);
    };
    
    // Créer le script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${config.api.googleMapsApiKey}&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    
    // Gestion des erreurs
    script.onerror = () => {
      reject(new Error('Impossible de charger Google Maps API'));
    };
    
    // Ajouter le script au document
    document.head.appendChild(script);
  });
};

/**
 * Initialise un autocomplete Google Places sur un champ input
 * @param {HTMLInputElement} inputElement - Élément input
 * @param {Object} options - Options d'autocomplete
 * @returns {google.maps.places.Autocomplete} - Instance d'autocomplete
 */
export const initAutocomplete = (inputElement, options = {}) => {
  if (!window.google || !window.google.maps || !window.google.maps.places) {
    console.error('Google Maps API n\'est pas chargée');
    return null;
  }
  
  // Options par défaut
  const defaultOptions = {
    componentRestrictions: { country: 'fr' },
    fields: ['address_components', 'geometry', 'name', 'formatted_address'],
    strictBounds: false,
    types: ['address']
  };
  
  // Fusionner les options
  const autocompleteOptions = { ...defaultOptions, ...options };
  
  // Créer l'autocomplete
  const autocomplete = new window.google.maps.places.Autocomplete(
    inputElement,
    autocompleteOptions
  );
  
  return autocomplete;
};

/**
 * Calcule l'itinéraire entre deux points avec l'API Directions de Google Maps
 * @param {Object} origin - Point de départ (lat, lng)
 * @param {Object} destination - Point d'arrivée (lat, lng)
 * @param {Object} options - Options de l'itinéraire
 * @returns {Promise<Object>} - Résultat de l'itinéraire
 */
export const calculateRoute = (origin, destination, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps) {
      reject(new Error('Google Maps API n\'est pas chargée'));
      return;
    }
    
    // Options par défaut
    const defaultOptions = {
      travelMode: window.google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true,
      provideRouteAlternatives: false,
      avoidFerries: true
    };
    
    // Fusionner les options
    const routeOptions = { 
      ...defaultOptions, 
      ...options,
      origin,
      destination
    };
    
    // Créer le service de directions
    const directionsService = new window.google.maps.DirectionsService();
    
    // Calculer l'itinéraire
    directionsService.route(routeOptions, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        resolve(result);
      } else {
        reject(new Error(`Erreur de calcul d'itinéraire: ${status}`));
      }
    });
  });
};

/**
 * Calcule la distance et la durée entre deux points avec l'API Distance Matrix de Google Maps
 * @param {Object|string} origin - Point de départ (lat, lng) ou adresse
 * @param {Object|string} destination - Point d'arrivée (lat, lng) ou adresse
 * @param {Object} options - Options de calcul
 * @returns {Promise<Object>} - Résultat de la distance et durée
 */
export const calculateDistance = (origin, destination, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps) {
      reject(new Error('Google Maps API n\'est pas chargée'));
      return;
    }
    
    // Options par défaut
    const defaultOptions = {
      travelMode: window.google.maps.TravelMode.DRIVING,
      unitSystem: window.google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    };
    
    // Fusionner les options
    const distanceOptions = { 
      ...defaultOptions, 
      ...options
    };
    
    // Créer le service de matrice de distance
    const distanceMatrixService = new window.google.maps.DistanceMatrixService();
    
    // Calculer la distance
    distanceMatrixService.getDistanceMatrix({
      origins: [origin],
      destinations: [destination],
      travelMode: distanceOptions.travelMode,
      unitSystem: distanceOptions.unitSystem,
      avoidHighways: distanceOptions.avoidHighways,
      avoidTolls: distanceOptions.avoidTolls
    }, (result, status) => {
      if (status === window.google.maps.DistanceMatrixStatus.OK) {
        if (result.rows[0].elements[0].status === 'OK') {
          const distance = result.rows[0].elements[0].distance;
          const duration = result.rows[0].elements[0].duration;
          
          resolve({
            distance: {
              value: distance.value, // en mètres
              text: distance.text
            },
            duration: {
              value: duration.value, // en secondes
              text: duration.text
            },
            origin: result.originAddresses[0],
            destination: result.destinationAddresses[0]
          });
        } else {
          reject(new Error(`Aucun itinéraire trouvé: ${result.rows[0].elements[0].status}`));
        }
      } else {
        reject(new Error(`Erreur de calcul de distance: ${status}`));
      }
    });
  });
};

/**
 * Géocode une adresse en coordonnées avec l'API Geocoding de Google Maps
 * @param {string} address - Adresse à géocoder
 * @returns {Promise<Object>} - Coordonnées géographiques
 */
export const geocodeWithGoogleMaps = (address) => {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps) {
      // Si l'API Google Maps n'est pas disponible, utilisez notre API
      geocodeAddress(address)
        .then(resolve)
        .catch(reject);
      return;
    }
    
    // Créer le service de géocodage
    const geocoder = new window.google.maps.Geocoder();
    
    // Géocoder l'adresse
    geocoder.geocode({ address }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK) {
        const location = results[0].geometry.location;
        
        resolve({
          lat: location.lat(),
          lng: location.lng(),
          formatted_address: results[0].formatted_address,
          place_id: results[0].place_id,
          components: results[0].address_components
        });
      } else {
        // Si le géocodage échoue, utilisez notre API comme solution de secours
        geocodeAddress(address)
          .then(resolve)
          .catch(() => {
            reject(new Error(`Erreur de géocodage: ${status}`));
          });
      }
    });
  });
};

/**
 * Convertit une adresse en coordonnées
 * Essaie d'abord avec Google Maps, puis avec notre API
 * @param {string} address - Adresse à convertir
 * @returns {Promise<Object>} - Coordonnées {lat, lng}
 */
export const getCoordinatesFromAddress = async (address) => {
  try {
    // Essayer d'abord avec Google Maps si disponible
    if (window.google && window.google.maps) {
      const result = await geocodeWithGoogleMaps(address);
      return { lat: result.lat, lng: result.lng };
    } else {
      // Sinon, utiliser notre API
      const result = await geocodeAddress(address);
      return { lat: result.lat, lng: result.lng };
    }
  } catch (error) {
    console.error('Erreur de géocodage:', error);
    
    // En cas d'échec, simuler une position dans l'Essonne
    return simulateCoordinates(address);
  }
};

/**
 * Simule des coordonnées pour une adresse
 * Utile en développement ou si les services de géocodage échouent
 * @param {string} address - Adresse à simuler
 * @returns {Object} - Coordonnées simulées {lat, lng}
 */
export const simulateCoordinates = (address) => {
  // Coordonnées pour des adresses spécifiques
  if (address.toLowerCase().includes('orly')) {
    return { lat: 48.7262, lng: 2.3652 };
  } else if (address.toLowerCase().includes('roissy') || address.toLowerCase().includes('cdg')) {
    return { lat: 49.0097, lng: 2.5479 };
  } else if (address.toLowerCase().includes('massy')) {
    return { lat: 48.7253, lng: 2.2730 };
  } else if (address.toLowerCase().includes('paris')) {
    return { lat: 48.8566, lng: 2.3522 };
  }
  
  // Générer des coordonnées aléatoires autour de l'Essonne
  const lat = config.location.center.lat + (Math.random() - 0.5) * 0.1;
  const lng = config.location.center.lng + (Math.random() - 0.5) * 0.1;
  
  return { lat, lng };
};

/**
 * Crée un marqueur sur une carte Google Maps
 * @param {google.maps.Map} map - Instance de la carte
 * @param {Object} position - Position du marqueur {lat, lng}
 * @param {Object} options - Options du marqueur
 * @returns {google.maps.Marker} - Instance du marqueur
 */
export const createMarker = (map, position, options = {}) => {
  if (!window.google || !window.google.maps) {
    console.error('Google Maps API n\'est pas chargée');
    return null;
  }
  
  // Options par défaut
  const defaultOptions = {
    map,
    position,
    animation: window.google.maps.Animation.DROP
  };
  
  // Fusionner les options
  const markerOptions = { ...defaultOptions, ...options };
  
  // Créer le marqueur
  return new window.google.maps.Marker(markerOptions);
};

/**
 * Crée une fenêtre d'info sur un marqueur Google Maps
 * @param {google.maps.Map} map - Instance de la carte
 * @param {google.maps.Marker} marker - Instance du marqueur
 * @param {string|Node} content - Contenu de la fenêtre d'info
 * @param {Object} options - Options de la fenêtre d'info
 * @returns {google.maps.InfoWindow} - Instance de la fenêtre d'info
 */
export const createInfoWindow = (map, marker, content, options = {}) => {
  if (!window.google || !window.google.maps) {
    console.error('Google Maps API n\'est pas chargée');
    return null;
  }
  
  // Options par défaut
  const defaultOptions = {
    content
  };
  
  // Fusionner les options
  const infoOptions = { ...defaultOptions, ...options };
  
  // Créer la fenêtre d'info
  const infoWindow = new window.google.maps.InfoWindow(infoOptions);
  
  // Ajouter l'événement de clic au marqueur
  marker.addListener('click', () => {
    infoWindow.open(map, marker);
  });
  
  return infoWindow;
};