import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { loadGoogleMapsScript, waitForGooglePlaces } from '../../utils/mapsHelper';
import config from '../../config';

/**
 * Composant d'autocomplete d'adresse utilisant Google Places API
 * ou une simulation en mode développement
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
    let isMounted = true;
    
    const initGoogleMaps = async () => {
      try {
        console.log('Tentative de chargement de Google Maps API');
        await loadGoogleMapsScript();
        
        // S'assurer que Places est bien chargé
        await waitForGooglePlaces();
        
        if (isMounted) {
          console.log('Google Maps et Places API chargés avec succès');
          setIsScriptLoaded(true);
          setScriptError(null);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'API:', error);
        if (isMounted) {
          setScriptError('Impossible de charger l\'API. Mode simulation activé.');
          // Activer le mode simulation
          setSuggestions(simulateSuggestions(value || ''));
        }
      }
    };

    initGoogleMaps();
    
    // Nettoyage
    return () => {
      isMounted = false;
    };
  }, []);

  // Initialisation de l'autocomplete
  useEffect(() => {
    if (!isScriptLoaded || !inputRef.current) return;
    
    // Vérifier que Places API est disponible
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.error('Places API non disponible');
      setScriptError('La fonctionnalité Google Places n\'est pas disponible. Mode simulation activé.');
      return;
    }

    try {
      console.log('Initialisation de l\'autocomplete');
      
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
      
      console.log('Autocomplete créé avec succès');

      // Écouter les changements de lieu sélectionné
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        
        if (place) {
          // Vérifier si nous avons une adresse formatée
          if (place.formatted_address) {
            console.log('Adresse formatée sélectionnée:', place.formatted_address);
            
            // Créer un événement pour simuler un changement de champ
            const event = { 
              target: { 
                name, 
                value: place.formatted_address 
              } 
            };
            
            // Mettre à jour la valeur avec l'adresse formatée complète
            onChange(event);
            
            // S'assurer que le champ input est aussi mis à jour
            if (inputRef.current) {
              inputRef.current.value = place.formatted_address;
            }
            
            setShowSuggestions(false);
          } else if (place.name) {
            // Fallback au nom du lieu si pas d'adresse formatée
            console.log('Nom du lieu sélectionné:', place.name);
            
            const event = { 
              target: { 
                name, 
                value: place.name 
              } 
            };
            
            onChange(event);
            
            if (inputRef.current) {
              inputRef.current.value = place.name;
            }
            
            setShowSuggestions(false);
          } else {
            console.warn('Lieu sélectionné sans adresse formatée ou nom');
          }
        } else {
          console.warn('Aucun lieu sélectionné');
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
        
        // Nettoyage de l'autocomplete
        if (autocompleteRef.current && window.google && window.google.maps) {
          window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }
      };
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'autocomplete:', error);
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
    console.log('Suggestion sélectionnée:', suggestion);
    
    // Créer un événement simulé
    const event = { 
      target: { 
        name, 
        value: suggestion
      } 
    };
    
    // Mettre à jour la valeur
    onChange(event);
    
    // Mettre à jour la valeur dans l'input
    if (inputRef.current) {
      inputRef.current.value = suggestion;
    }
    
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
          autoComplete="off" // Désactiver l'autocomplétion du navigateur
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