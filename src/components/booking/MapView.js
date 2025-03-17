import React, { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { useBooking } from '../../context/BookingContext';
import config from '../../config';

// Styles pour la carte
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

// Options de la carte
const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  scrollwheel: false,
  styles: [
    {
      "featureType": "administrative",
      "elementType": "labels.text.fill",
      "stylers": [{"color": "#444444"}]
    },
    {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [{"color": "#f2f2f2"}]
    },
    {
      "featureType": "poi",
      "elementType": "all",
      "stylers": [{"visibility": "off"}]
    },
    {
      "featureType": "road",
      "elementType": "all",
      "stylers": [{"saturation": -100}, {"lightness": 45}]
    },
    {
      "featureType": "road.highway",
      "elementType": "all",
      "stylers": [{"visibility": "simplified"}]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.icon",
      "stylers": [{"visibility": "off"}]
    },
    {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [{"visibility": "simplified"}]
    },
    {
      "featureType": "water",
      "elementType": "all",
      "stylers": [{"color": "#c4c4c4"}, {"visibility": "on"}]
    }
  ]
};

const MapView = () => {
  const { bookingData, bookingStep } = useBooking();
  
  // État pour les marqueurs et directions
  const [pickupMarker, setPickupMarker] = useState(null);
  const [destinationMarker, setDestinationMarker] = useState(null);
  const [directions, setDirections] = useState(null);
  const [center, setCenter] = useState(config.location.center);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  
  // Charger l'API Google Maps
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: config.api.googleMapsApiKey,
    libraries: ['places'],
  });
  
  // Géocoder une adresse
  const geocodeAddress = async (address) => {
    try {
      // Simuler le géocodage pour l'exemple
      // Dans une application réelle, vous utiliseriez l'API Geocoding de Google
      if (address.toLowerCase().includes('orly') || address.toLowerCase().includes('aéroport')) {
        return { lat: 48.7262, lng: 2.3652 }; // Coordonnées d'Orly
      } else if (address.toLowerCase().includes('roissy') || address.toLowerCase().includes('cdg')) {
        return { lat: 49.0097, lng: 2.5479 }; // Coordonnées de CDG
      } else if (address.toLowerCase().includes('massy')) {
        return { lat: 48.7253, lng: 2.2730 }; // Coordonnées de Massy
      } else if (address.toLowerCase().includes('paris')) {
        return { lat: 48.8566, lng: 2.3522 }; // Coordonnées de Paris
      } else {
        // Générer des coordonnées aléatoires autour de l'Essonne pour la démo
        const lat = config.location.center.lat + (Math.random() - 0.5) * 0.1;
        const lng = config.location.center.lng + (Math.random() - 0.5) * 0.1;
        return { lat, lng };
      }
    } catch (error) {
      console.error("Erreur de géocodage:", error);
      return null;
    }
  };
  
  // Calculer l'itinéraire entre les points
  const calculateRoute = async (origin, destination) => {
    if (!window.google || !origin || !destination) return;
    
    const directionsService = new window.google.maps.DirectionsService();
    
    try {
      const result = await directionsService.route({
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });
      
      setDirections(result);
      return result;
    } catch (error) {
      console.error("Erreur de calcul d'itinéraire:", error);
      return null;
    }
  };
  
  // Mettre à jour les marqueurs et l'itinéraire lorsque les adresses changent
  useEffect(() => {
    if (!isLoaded || !isMapLoaded) return;
    
    const updateMap = async () => {
      // Si les deux adresses sont renseignées
      if (bookingData.pickupAddress && bookingData.destinationAddress) {
        // Géocoder les adresses
        const originCoords = await geocodeAddress(bookingData.pickupAddress);
        const destinationCoords = await geocodeAddress(bookingData.destinationAddress);
        
        if (originCoords && destinationCoords) {
          setPickupMarker(originCoords);
          setDestinationMarker(destinationCoords);
          
          // Calculer l'itinéraire
          calculateRoute(originCoords, destinationCoords);
          
          // Ajuster le centre et le zoom pour montrer l'itinéraire complet
          const bounds = new window.google.maps.LatLngBounds();
          bounds.extend(new window.google.maps.LatLng(originCoords.lat, originCoords.lng));
          bounds.extend(new window.google.maps.LatLng(destinationCoords.lat, destinationCoords.lng));
          
          // Utiliser le centre des limites comme nouveau centre
          const newCenter = {
            lat: (originCoords.lat + destinationCoords.lat) / 2,
            lng: (originCoords.lng + destinationCoords.lng) / 2,
          };
          setCenter(newCenter);
        }
      } else if (bookingData.pickupAddress) {
        // Si seule l'adresse de départ est renseignée
        const originCoords = await geocodeAddress(bookingData.pickupAddress);
        
        if (originCoords) {
          setPickupMarker(originCoords);
          setDestinationMarker(null);
          setDirections(null);
          setCenter(originCoords);
        }
      } else if (bookingData.destinationAddress) {
        // Si seule l'adresse de destination est renseignée
        const destinationCoords = await geocodeAddress(bookingData.destinationAddress);
        
        if (destinationCoords) {
          setPickupMarker(null);
          setDestinationMarker(destinationCoords);
          setDirections(null);
          setCenter(destinationCoords);
        }
      }
    };
    
    updateMap();
  }, [bookingData.pickupAddress, bookingData.destinationAddress, isLoaded, isMapLoaded]);
  
  // Gérer le chargement de la carte
  const onMapLoad = (map) => {
    setIsMapLoaded(true);
  };
  
  // Afficher un message de chargement si l'API n'est pas chargée
  if (loadError) {
    return (
      <div className="map-error">
        <p>Erreur de chargement de la carte.</p>
        <p>Veuillez vérifier votre connexion internet ou réessayer plus tard.</p>
      </div>
    );
  }
  
  // Afficher un placeholder si l'API est en cours de chargement
  if (!isLoaded) {
    return (
      <div className="map-loading">
        <div className="loading-spinner"></div>
        <p>Chargement de la carte...</p>
      </div>
    );
  }
  
  return (
    <div className="map-view-container">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
        options={mapOptions}
        onLoad={onMapLoad}
      >
        {/* Marqueur de départ */}
        {pickupMarker && (
          <Marker
            position={pickupMarker}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        )}
        
        {/* Marqueur de destination */}
        {destinationMarker && (
          <Marker
            position={destinationMarker}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        )}
        
        {/* Afficher l'itinéraire */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#FFCA28',
                strokeWeight: 5,
                strokeOpacity: 0.7,
              },
            }}
          />
        )}
      </GoogleMap>
      
      {/* Zone de service */}
      {bookingStep === 'form' && !pickupMarker && !destinationMarker && (
        <div className="map-overlay">
          <div className="zone-info">
            <h3>Notre zone de service</h3>
            <p>Nous desservons tout le département de l'Essonne (91) et proposons des transferts vers les principaux aéroports et gares de la région parisienne.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;