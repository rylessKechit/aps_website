import React, { useEffect } from 'react';
import HeroWithSimulator from '../components/home/HeroWithSimulator';
import Services from '../components/home/Services';
import Vehicles from '../components/home/Vehicles';
import ServiceArea from '../components/home/ServiceArea';
import Testimonials from '../components/home/Testimonials';
import AppPromotion from '../components/home/AppPromotion';
import WhyUs from '../components/home/WhyUs';
import { useBooking } from '../context/BookingContext';

const HomePage = () => {
  const { setIsSimpleForm } = useBooking();
  
  // Définir la forme simple du formulaire pour la page d'accueil
  useEffect(() => {
    setIsSimpleForm(true);
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [setIsSimpleForm]);
  
  return (
    <>
      <HeroWithSimulator />
      
      <Services />
      
      <Vehicles />
      
      <ServiceArea />
      
      <Testimonials />
      
      <AppPromotion />
      
      <WhyUs />
    </>
  );
};

export default HomePage;