import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import config from '../../config';

/**
 * Composant d'autocomplete d'adresse utilisant Google Places API
 * ou une simulation en mode développement
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
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
      // Utiliser des suggestions simulées si l'API échoue
      console.warn('Échec du chargement de l\'API, utilisation de suggestions simulées');
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
          setShowSuggestions(false);
        }
      });

      // Observer les changements du DOM pour supprimer le "powered by Google"
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            const pacContainers = document.querySelectorAll('.pac-container');
            pacContainers.forEach(container => {
              // S'assurer que le "powered by Google" est supprimé
              if (container.lastChild && container.lastChild.tagName === 'DIV' && 
                  container.lastChild.textContent.includes('Google')) {
                container.removeChild(container.lastChild);
              }
            });
          }
        }
      });

      // Observer les changements au niveau du body
      observer.observe(document.body, { 
        childList: true, 
        subtree: true 
      });

      return () => {
        observer.disconnect();
      };
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'autocomplete :', error);
      setScriptError('Erreur avec l\'autocomplétion. Saisissez votre adresse complète.');
    }
  }, [isScriptLoaded, name, onChange]);

  // Simuler des suggestions si l'API n'est pas disponible ou échoue
  const simulateSuggestions = (query) => {
    if (!query || query.length < 3) return [];
    
    const mockAddresses = [
      ...config.booking.commonAddresses,
      'Aéroport d\'Orly, 94310 Orly, France',
      'Aéroport Roissy Charles de Gaulle, 95700, France',
      'Gare de Massy TGV, 91300 Massy, France',
      'Gare de Lyon, Paris, France',
      'Gare Montparnasse, Paris, France',
      'Centre Commercial Évry 2, Évry, France',
      'Université Paris-Saclay, Orsay, France',
      'Place de la République, Paris, France',
      'La Défense, Paris, France',
      'Tour Eiffel, Paris, France',
      'Disneyland Paris, Marne-la-Vallée, France',
      'Château de Versailles, Versailles, France'
    ];
    
    return mockAddresses
      .filter(addr => addr.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
  };

  // Gérer le changement de texte
  const handleInputChange = (e) => {
    const { value } = e.target;
    onChange(e);
    
    // En cas d'échec de l'API, utiliser des suggestions simulées
    if (scriptError || !isScriptLoaded) {
      const newSuggestions = simulateSuggestions(value);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    }
  };

  // Gérer la sélection d'une suggestion
  const handleSuggestionClick = (suggestion) => {
    const event = { 
      target: { 
        name, 
        value: suggestion
      } 
    };
    
    onChange(event);
    setShowSuggestions(false);
  };

  // Gérer le focus sur l'input
  const handleFocus = () => {
    if (scriptError || !isScriptLoaded) {
      const newSuggestions = simulateSuggestions(value);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    }
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

      <div className="address-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          id={id}
          name={name}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className={inputClasses}
          required={required}
          {...rest}
        />
        <MapPin className="address-input-icon" size={18} />
        
        {/* Suggestions simulées en cas d'erreur */}
        {showSuggestions && (scriptError || !isScriptLoaded) && (
          <div className="address-suggestions">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index} 
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {scriptError && <div className="helper-text">{scriptError}</div>}
    </div>
  );
};

export default GooglePlacesAutocomplete;