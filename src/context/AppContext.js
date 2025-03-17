import React, { createContext, useContext, useState, useEffect } from 'react';

// Création du contexte
const AppContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useApp = () => useContext(AppContext);

// Fournisseur du contexte
export const AppProvider = ({ children }) => {
  // État pour le thème
  const [darkMode, setDarkMode] = useState(false);
  
  // État pour la langue
  const [language, setLanguage] = useState('fr');
  
  // État pour les notifications
  const [notifications, setNotifications] = useState([]);
  
  // État pour l'état de chargement global
  const [isLoading, setIsLoading] = useState(false);
  
  // Vérifier les préférences de l'utilisateur pour le thème sombre
  useEffect(() => {
    // Vérifier si l'utilisateur a une préférence enregistrée
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    } else {
      // Vérifier la préférence système
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDarkMode);
    }
    
    // Appliquer le thème au document
    document.documentElement.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);
  
  // Fonction pour basculer le thème
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark-mode', newDarkMode);
  };
  
  // Fonction pour changer la langue
  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };
  
  // Fonction pour ajouter une notification
  const addNotification = (message, type = 'info', duration = 5000) => {
    const id = Date.now();
    const notification = { id, message, type, duration };
    
    setNotifications(prev => [...prev, notification]);
    
    // Supprimer la notification après la durée spécifiée
    if (duration) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
    
    return id;
  };
  
  // Fonction pour supprimer une notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  return (
    <AppContext.Provider value={{
      darkMode,
      toggleDarkMode,
      language,
      changeLanguage,
      notifications,
      addNotification,
      removeNotification,
      isLoading,
      setIsLoading
    }}>
      {children}
    </AppContext.Provider>
  );
};