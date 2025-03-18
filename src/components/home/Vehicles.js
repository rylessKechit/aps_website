import React from 'react';
import { 
  Users, 
  Briefcase, 
  Wifi, 
  Cloud, 
  Zap, 
  Usb, 
  Droplet, 
  Monitor, 
  Leaf,
  Users as UsersGroup
} from 'lucide-react';
import config from '../../config';

const ModernVehicles = () => {
  // Référence aux types de véhicules depuis la configuration
  const vehicleTypes = config.vehicles.types;
  
  // Helper pour obtenir l'icône appropriée pour les caractéristiques
  const getFeatureIcon = (feature) => {
    if (feature.includes('WiFi')) return <Wifi size={16} />;
    if (feature.includes('Climat')) return <Cloud size={16} />;
    if (feature.includes('USB')) return <Usb size={16} />;
    if (feature.includes('eau')) return <Droplet size={16} />;
    if (feature.includes('Écran')) return <Monitor size={16} />;
    if (feature.includes('Zéro')) return <Leaf size={16} />;
    // Icône par défaut
    return <Cloud size={16} />;
  };

  // Fonction pour déterminer les badges spéciaux
  const getHighlightBadge = (vehicleId) => {
    if (vehicleId === 'electrique') {
      return (
        <div className="vehicle-highlight eco-highlight">
          <Leaf size={16} /> Véhicule écologique
        </div>
      );
    }
    
    if (vehicleId === 'van') {
      return (
        <div className="vehicle-highlight space-highlight">
          <UsersGroup size={16} /> Idéal pour groupes
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <section className="notre-flotte-section">
      <div className="section-title-container">
        <h2 className="section-title">Notre flotte</h2>
        <p className="section-subtitle">Des véhicules récents et entretenus pour votre confort et sécurité</p>
      </div>
      
      <div className="vehicles-container">
        {vehicleTypes.map((vehicle) => (
          <div className="vehicle-card" key={vehicle.id}>
            <div className="vehicle-badge">{vehicle.name}</div>
            
            <div className="vehicle-header">
              <h3 className="vehicle-title">{vehicle.name}</h3>
              <p className="vehicle-model">{vehicle.description}</p>
            </div>
            
            <div className="vehicle-photo">
              <img 
                src={`/images/vehicles/${vehicle.id}.png`} 
                alt={vehicle.name}
              />
            </div>
            
            <div className="vehicle-main-info">
              <div className="info-item">
                <Users size={16} /> {vehicle.capacity.passengers} passagers
              </div>
              <div className="info-item">
                <Briefcase size={16} /> {vehicle.capacity.luggage} bagages
              </div>
            </div>
            
            <div className="vehicle-features">
              <ul className="feature-list">
                {vehicle.features.map((feature, index) => (
                  <li className="feature-item" key={index}>
                    {getFeatureIcon(feature)} {feature}
                  </li>
                ))}
              </ul>
              
              {getHighlightBadge(vehicle.id)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ModernVehicles;