import React from 'react';
import { Car, Zap, Truck } from 'lucide-react';
import config from '../../config';

const VehicleSelector = ({ selected, onChange }) => {
  const vehicleTypes = config.vehicles.types;
  
  const getVehicleIcon = (vehicleType) => {
    switch (vehicleType) {
      case 'berline':
        return <Car size={24} />;
      case 'electrique':
        return <Zap size={24} />;
      case 'van':
        return <Truck size={24} />;
      default:
        return <Car size={24} />;
    }
  };
  
  return (
    <div className="vehicle-options">
      {vehicleTypes.map(vehicle => (
        <div 
          key={vehicle.id}
          className={`vehicle-option ${selected === vehicle.id ? 'active' : ''}`}
          onClick={() => onChange(vehicle.id)}
        >
          <div className="vehicle-icon">
            {getVehicleIcon(vehicle.id)}
          </div>
          <div className="vehicle-info">
            <span className="vehicle-name">{vehicle.name}</span>
            <span className="vehicle-capacity">{vehicle.capacity.passengers} passagers max</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VehicleSelector;