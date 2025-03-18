import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import config from '../../config';

/**
 * Composant d'autocomplete d'adresse utilisant Google Places API
 * 
 * @param {Object} props
 * @param {string} props.id - ID du champ
 * @param {string} props.name - Nom du champ pour les formulaires
 * @param {string} props.value - Valeur actuelle du champ
 * @param {Function} props.onChange - Fonction appelée lors du changement de valeur
 * @param {string} props.placeholder - Texte d'indication
 * @param {boolean} props.required - Si le champ est requis
 * @param {string} props.label - Étiquette du champ
 * @param {string} props.error - Message d'erreur éventuel
 */
const GooglePlacesAutocomplete = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  label,
  error,
  ...rest
}) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(null);

  // Chargement du script Google Maps
  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${config.api.googleMapsApiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setIsScriptLoaded(true);
    };

    script.onerror = () => {
      setScriptError('Impossible de charger Google Maps API');
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Initialisation de l'autocomplete
  useEffect(() => {
    if (!isScriptLoaded || !inputRef.current) return;

    try {
      // Configuration de l'autocomplete
      const options = {
        componentRestrictions: { country: 'fr' },
        fields: ['address_components', 'geometry', 'name', 'formatted_address'],
        strictBounds: false,
        types: ['address']
      };

      // Création de l'autocomplete
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        options
      );

      // Écouter les changements de lieu sélectionné
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        
        if (place && place.formatted_address) {
          // Créer un événement pour simuler un changement de champ
          const event = { 
            target: { 
              name, 
              value: place.formatted_address 
            } 
          };
          
          onChange(event);
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'autocomplete :', error);
    }
  }, [isScriptLoaded, name, onChange]);

  // Créer un gestionnaire d'événements personnalisé pour les changements manuels
  const handleChange = (e) => {
    onChange(e);
  };

  // Classes CSS
  const inputContainerClasses = [
    'input-container',
    error ? 'has-error' : ''
  ].filter(Boolean).join(' ');

  const inputClasses = [
    'form-control',
    error ? 'error' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={inputContainerClasses}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}

      <div className="input-icon-wrapper">
        <MapPin size={18} className="input-icon" />
        <input
          ref={inputRef}
          type="text"
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={inputClasses}
          required={required}
          disabled={!isScriptLoaded}
          {...rest}
        />
      </div>

      {error && <div className="error-message">{error}</div>}
      {scriptError && <div className="error-message">{scriptError}</div>}
    </div>
  );
};

export default GooglePlacesAutocomplete;