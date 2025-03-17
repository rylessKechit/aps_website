/**
 * Formate une date au format "DD/MM/YYYY"
 * @param {Date|string} date - Date à formater
 * @returns {string} - Date formatée
 */
export const formatDate = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    
    // Vérifier si la date est valide
    if (isNaN(d.getTime())) return '';
    
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    return `${day}/${month}/${year}`;
  };
  
  /**
   * Formate une heure au format "HH:MM"
   * @param {Date|string} time - Date/heure à formater
   * @returns {string} - Heure formatée
   */
  export const formatTime = (time) => {
    if (!time) return '';
    
    const d = new Date(time);
    
    // Vérifier si la date est valide
    if (isNaN(d.getTime())) return '';
    
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    
    return `${hours}:${minutes}`;
  };
  
  /**
   * Formate une date et heure au format "DD/MM/YYYY à HH:MM"
   * @param {Date|string} dateTime - Date et heure à formater
   * @returns {string} - Date et heure formatées
   */
  export const formatDateTime = (dateTime) => {
    if (!dateTime) return '';
    
    const date = formatDate(dateTime);
    const time = formatTime(dateTime);
    
    if (!date || !time) return '';
    
    return `${date} à ${time}`;
  };
  
  /**
   * Récupère la date actuelle au format YYYY-MM-DD pour les champs input date
   * @returns {string} - Date au format YYYY-MM-DD
   */
  export const getCurrentDateForInput = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };
  
  /**
   * Récupère une date future (date actuelle + minutes) au format YYYY-MM-DD
   * @param {number} minutes - Minutes à ajouter à la date actuelle
   * @returns {string} - Date au format YYYY-MM-DD
   */
  export const getFutureDateForInput = (minutes) => {
    const now = new Date();
    const future = new Date(now.getTime() + minutes * 60000);
    
    const year = future.getFullYear();
    const month = String(future.getMonth() + 1).padStart(2, '0');
    const day = String(future.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };
  
  /**
   * Récupère l'heure actuelle + minutes au format HH:MM pour les champs input time
   * @param {number} minutes - Minutes à ajouter à l'heure actuelle
   * @returns {string} - Heure au format HH:MM
   */
  export const getFutureTimeForInput = (minutes) => {
    const now = new Date();
    const future = new Date(now.getTime() + minutes * 60000);
    
    const hours = String(future.getHours()).padStart(2, '0');
    const mins = String(future.getMinutes()).padStart(2, '0');
    
    return `${hours}:${mins}`;
  };
  
  /**
   * Combine une date et une heure en un seul objet Date
   * @param {Date|string} date - Date
   * @param {Date|string} time - Heure
   * @returns {Date} - Objet Date combiné
   */
  export const combineDateAndTime = (date, time) => {
    const dateObj = new Date(date);
    const timeObj = new Date(time);
    
    // Vérifier si les dates sont valides
    if (isNaN(dateObj.getTime()) || isNaN(timeObj.getTime())) return new Date();
    
    const result = new Date(dateObj);
    result.setHours(
      timeObj.getHours(),
      timeObj.getMinutes(),
      0,
      0
    );
    
    return result;
  };
  
  /**
   * Calcule la différence en minutes entre deux dates
   * @param {Date|string} date1 - Première date
   * @param {Date|string} date2 - Deuxième date
   * @returns {number} - Différence en minutes
   */
  export const getMinutesDifference = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    // Vérifier si les dates sont valides
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0;
    
    // Différence en millisecondes
    const diff = d2.getTime() - d1.getTime();
    
    // Convertir en minutes
    return Math.floor(diff / 60000);
  };
  
  /**
   * Vérifie si une date est dans le futur
   * @param {Date|string} date - Date à vérifier
   * @param {number} minMinutes - Minutes minimum dans le futur
   * @returns {boolean} - True si la date est suffisamment dans le futur
   */
  export const isFutureDate = (date, minMinutes = 0) => {
    const dateObj = new Date(date);
    const now = new Date();
    
    // Vérifier si la date est valide
    if (isNaN(dateObj.getTime())) return false;
    
    // Ajouter les minutes minimum
    const minFutureTime = new Date(now.getTime() + minMinutes * 60000);
    
    return dateObj > minFutureTime;
  };