import { geocodeAddress } from './api';
import config from '../config';

/**
 * Charge le script Google Maps de manière asynchrone
 * @returns {Promise} - Promise résolue quand le script est chargé
 */
export const loadGoogleMapsScript = () => {
  return new Promise((resolve, reject) => {
    // Vérifier si le script est déjà chargé et fonctionnel
    if (window.google && window.google.maps && window.google.maps.places) {
      console.log('API Google Maps et Places déjà chargée');
      resolve(window.google.maps);
      return;
    }
    
    // Vérifier si le script est déjà en cours de chargement
    if (document.querySelector('script[src*="maps.googleapis.com/maps/api"]')) {
      console.log('Script Google Maps déjà en cours de chargement, attente...');
      
      // Attendre que l'API soit complètement disponible
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
          console.log('API Google Maps et Places disponible après attente');
          clearInterval(checkInterval);
          resolve(window.google.maps);
        }
      }, 100);
      
      // Timeout après 10 secondes pour éviter une attente infinie
      setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error('Timeout lors du chargement de Google Maps API'));
      }, 10000);
      
      return;
    }
    
    // Callback quand le script est chargé
    window.initGoogleMaps = () => {
      console.log('Callback initGoogleMaps appelé');
      
      // Vérifier que places est bien chargé
      if (window.google && window.google.maps && window.google.maps.places) {
        console.log('API Google Maps et Places chargée avec succès');
        resolve(window.google.maps);
      } else {
        console.error('Erreur: la bibliothèque Places n\'est pas disponible');
        reject(new Error('La bibliothèque Places n\'est pas disponible'));
      }
    };
    
    // Créer le script
    console.log('Création du script Google Maps API');
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${config.api.googleMapsApiKey}&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    
    // Gestion des erreurs
    script.onerror = (error) => {
      console.error('Erreur lors du chargement du script Google Maps:', error);
      reject(new Error('Impossible de charger Google Maps API'));
    };
    
    // Ajouter le script au document
    document.head.appendChild(script);
    console.log('Script Google Maps ajouté au document');
  });
};

/**
 * Attend que l'API Google Places soit disponible
 * @param {number} maxRetries - Nombre maximum de tentatives
 * @param {number} interval - Intervalle entre les tentatives en ms
 * @returns {Promise} - Promise résolue quand l'API est disponible
 */
export const waitForGooglePlaces = (maxRetries = 20, interval = 200) => {
  return new Promise((resolve, reject) => {
    let retries = 0;
    
    const checkPlaces = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        console.log('Google Places API disponible');
        resolve(window.google.maps.places);
        return;
      }
      
      retries++;
      if (retries < maxRetries) {
        setTimeout(checkPlaces, interval);
      } else {
        console.error(`Google Places API non disponible après ${maxRetries} tentatives`);
        reject(new Error('Google Places API non disponible après plusieurs tentatives'));
      }
    };
    
    checkPlaces();
  });
};

/**
 * Initialise un autocomplete Google Places sur un champ input
 * @param {HTMLInputElement} inputElement - Élément input
 * @param {Object} options - Options d'autocomplete
 * @returns {Promise<google.maps.places.Autocomplete>} - Promise résolue avec l'instance d'autocomplete
 */
export const initAutocomplete = async (inputElement, options = {}) => {
  try {
    // S'assurer que l'API est chargée
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      await loadGoogleMapsScript();
      await waitForGooglePlaces();
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
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de l\'autocomplete:', error);
    throw error;
  }
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
 * en prenant en compte les conditions de circulation actuelles
 * @param {string} origin - Adresse de départ
 * @param {string} destination - Adresse d'arrivée
 * @param {Date|null} departureTime - Heure de départ (null pour maintenant)
 * @returns {Promise<Object>} - Résultat de la distance et durée
 */
export const calculateDistanceMatrix = async (origin, destination, departureTime = null) => {
  try {
    // S'assurer que l'API Maps est chargée
    if (!window.google || !window.google.maps) {
      // Tenter de charger l'API
      try {
        await loadGoogleMapsScript();
      } catch (error) {
        console.error('Échec du chargement de Google Maps API:', error);
        throw new Error('Google Maps API non disponible');
      }
    }
    
    // S'assurer que l'API est maintenant disponible
    if (!window.google || !window.google.maps) {
      throw new Error('Google Maps API toujours non disponible après chargement');
    }
    
    // Créer le service Distance Matrix
    const service = new window.google.maps.DistanceMatrixService();
    
    // Options pour prendre en compte le trafic en temps réel
    const requestOptions = {
      origins: [origin],
      destinations: [destination],
      travelMode: window.google.maps.TravelMode.DRIVING,
      unitSystem: window.google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false,
      // Options de trafic en temps réel
      drivingOptions: {
        departureTime: departureTime || new Date(), // Utiliser l'heure actuelle par défaut
        trafficModel: window.google.maps.TrafficModel.BEST_GUESS
      }
    };
    
    console.log('Calcul de distance avec options:', requestOptions);
    
    // Effectuer la requête
    const result = await new Promise((resolve, reject) => {
      service.getDistanceMatrix(
        requestOptions,
        (response, status) => {
          if (status === 'OK') {
            resolve(response);
          } else {
            reject(new Error(`Erreur Distance Matrix: ${status}`));
          }
        }
      );
    });
    
    // Traiter le résultat
    const row = result.rows[0];
    const element = row.elements[0];
    
    if (element.status === 'OK') {
      // Récupérer les informations de distance et durée
      const distanceText = element.distance.text;
      const distanceValue = element.distance.value / 1000; // Convertir en km
      const durationText = element.duration.text;
      const durationValue = element.duration.value / 60; // Convertir en minutes
      
      // Récupérer la durée avec trafic si disponible
      const durationInTrafficText = element.duration_in_traffic ? element.duration_in_traffic.text : durationText;
      const durationInTrafficValue = element.duration_in_traffic ? element.duration_in_traffic.value / 60 : durationValue;
      
      console.log('Résultat du calcul de distance:', {
        distance: {
          text: distanceText,
          value: distanceValue
        },
        duration: {
          text: durationText,
          value: durationValue
        },
        durationInTraffic: {
          text: durationInTrafficText,
          value: durationInTrafficValue
        }
      });
      
      // Retourner les valeurs en prenant en compte le trafic
      return {
        distance: distanceValue,
        duration: durationInTrafficValue, // Utiliser la durée avec trafic
        distanceText: distanceText,
        durationText: durationInTrafficText
      };
    } else {
      console.error('Erreur d\'itinéraire:', element.status);
      throw new Error(`Erreur d'itinéraire: ${element.status}`);
    }
  } catch (error) {
    console.error('Erreur lors du calcul de distance:', error);
    
    // Log détaillé avant de revenir à la simulation
    console.warn('Utilisation de la simulation comme solution de repli');
    
    // Fallback sur la simulation si l'API échoue
    return simulateDistance(origin, destination);
  }
};

/**
 * Géocode une adresse en coordonnées avec l'API Geocoding de Google Maps
 * @param {string} address - Adresse à géocoder
 * @returns {Promise<Object>} - Coordonnées géographiques
 */
export const geocodeWithGoogleMaps = async (address) => {
  try {
    // S'assurer que l'API est chargée
    if (!window.google || !window.google.maps) {
      await loadGoogleMapsScript();
    }
    
    return new Promise((resolve, reject) => {
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
  } catch (error) {
    console.error('Erreur de géocodage avec Google Maps:', error);
    
    // Si l'API n'est pas disponible, utilisez notre API
    return geocodeAddress(address);
  }
};

/**
 * Convertit une adresse en coordonnées
 * Essaie d'abord avec Google Maps, puis avec notre API
 * @param {string} address - Adresse à convertir
 * @returns {Promise<Object>} - Coordonnées {lat, lng}
 */
export const getCoordinatesFromAddress = async (address) => {
  try {
    // Essayer d'abord avec Google Maps
    const result = await geocodeWithGoogleMaps(address);
    return { lat: result.lat, lng: result.lng };
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
 * Simule la distance entre deux points (fallback si Google Maps API échoue)
 * @param {string} origin - Adresse de départ
 * @param {string} destination - Adresse d'arrivée
 * @returns {Object} - Distance et durée estimées
 */
export const simulateDistance = (origin, destination) => {
  // Vérifier si c'est un trajet aéroport
  const isAirport = origin.toLowerCase().includes('orly') || 
                   destination.toLowerCase().includes('orly') ||
                   origin.toLowerCase().includes('roissy') || 
                   destination.toLowerCase().includes('roissy') ||
                   origin.toLowerCase().includes('cdg') || 
                   destination.toLowerCase().includes('cdg');
  
  // Vérifier si c'est un trajet gare
  const isStation = origin.toLowerCase().includes('gare') || 
                    destination.toLowerCase().includes('gare') ||
                    origin.toLowerCase().includes('station') || 
                    destination.toLowerCase().includes('station');
  
  // Simuler une distance en fonction du type de trajet
  if (isAirport) {
    const distance = Math.random() * (40 - 25) + 25; // 25-40 km pour un aéroport
    const duration = Math.random() * (60 - 30) + 30; // 30-60 minutes
    
    return {
      distance,
      duration,
      distanceText: `${distance.toFixed(1)} km`,
      durationText: `${Math.round(duration)} min`
    };
  } else if (isStation) {
    const distance = Math.random() * (25 - 12) + 12; // 12-25 km pour une gare
    const duration = Math.random() * (40 - 20) + 20; // 20-40 minutes
    
    return {
      distance,
      duration,
      distanceText: `${distance.toFixed(1)} km`,
      durationText: `${Math.round(duration)} min`
    };
  } else {
    const distance = Math.random() * (25 - 5) + 5; // 5-25 km pour un trajet local
    const duration = Math.random() * (40 - 10) + 10; // 10-40 minutes
    
    return {
      distance,
      duration,
      distanceText: `${distance.toFixed(1)} km`,
      durationText: `${Math.round(duration)} min`
    };
  }
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