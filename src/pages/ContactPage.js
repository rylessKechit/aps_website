import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import config from '../config';

const ContactPage = () => {
  // Défiler vers le haut de la page au chargement
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // État du formulaire
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  // État de validation
  const [errors, setErrors] = useState({});
  
  // État de soumission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Gérer le changement des champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Nettoyer l'erreur lorsque l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Valider le formulaire
  const validateForm = () => {
    const newErrors = {};
    
    // Validation du nom
    if (!formData.name.trim()) {
      newErrors.name = 'Veuillez entrer votre nom';
    }
    
    // Validation de l'email
    if (!formData.email.trim()) {
      newErrors.email = 'Veuillez entrer votre email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Veuillez entrer un email valide';
    }
    
    // Validation du téléphone (optionnel, mais doit être valide si renseigné)
    if (formData.phone.trim() && !/^[+\d\s()-]{10,20}$/.test(formData.phone)) {
      newErrors.phone = 'Veuillez entrer un numéro de téléphone valide';
    }
    
    // Validation du message
    if (!formData.message.trim()) {
      newErrors.message = 'Veuillez entrer votre message';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Votre message doit contenir au moins 10 caractères';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Valider le formulaire
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Réinitialiser le formulaire
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Indiquer que le formulaire a été soumis avec succès
      setSubmitted(true);
      
      // Masquer le message de succès après 5 secondes
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du formulaire', error);
      
      // Afficher une erreur générale
      setErrors(prev => ({
        ...prev,
        general: 'Une erreur est survenue lors de l\'envoi du formulaire. Veuillez réessayer.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="contact-page">
      <div className="page-hero">
        <div className="container">
          <h1>Contactez-nous</h1>
          <p>Nous sommes à votre disposition pour répondre à toutes vos questions</p>
        </div>
      </div>
      
      <div className="container">
        <div className="contact-content">
          <motion.div 
            className="contact-info"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Nos coordonnées</h2>
            <p>Nous sommes à votre écoute pour toute demande de renseignement ou réservation.</p>
            
            <div className="contact-details">
              <div className="contact-item">
                <Phone size={24} />
                <div>
                  <h3>Téléphone</h3>
                  <p>
                    <a href={`tel:${config.company.phone.replace(/\s/g, '')}`}>
                      {config.company.phone}
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="contact-item">
                <Mail size={24} />
                <div>
                  <h3>Email</h3>
                  <p>
                    <a href={`mailto:${config.company.email}`}>
                      {config.company.email}
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="contact-item">
                <MapPin size={24} />
                <div>
                  <h3>Adresse</h3>
                  <p>{config.company.address}</p>
                </div>
              </div>
              
              <div className="contact-item">
                <Clock size={24} />
                <div>
                  <h3>Horaires</h3>
                  <p>{config.company.operationHours}</p>
                </div>
              </div>
            </div>
            
            <div className="social-links">
              <a href={config.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="social-link">
                <Facebook size={20} />
              </a>
              <a href={config.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="social-link">
                <Instagram size={20} />
              </a>
              <a href={config.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="social-link">
                <Twitter size={20} />
              </a>
              <a href={config.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                <Linkedin size={20} />
              </a>
            </div>
          </motion.div>
          
          <motion.div 
            className="contact-form-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Envoyez-nous un message</h2>
            
            {submitted ? (
              <div className="form-success">
                <div className="success-icon">✓</div>
                <h3>Message envoyé avec succès!</h3>
                <p>Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                {errors.general && (
                  <div className="form-error general">{errors.general}</div>
                )}
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Nom*</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`form-control ${errors.name ? 'error' : ''}`}
                    />
                    {errors.name && <div className="error-message">{errors.name}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email*</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-control ${errors.email ? 'error' : ''}`}
                    />
                    {errors.email && <div className="error-message">{errors.email}</div>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Téléphone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`form-control ${errors.phone ? 'error' : ''}`}
                    />
                    {errors.phone && <div className="error-message">{errors.phone}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="subject">Sujet</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="reservation">Réservation</option>
                      <option value="information">Demande d'information</option>
                      <option value="reclamation">Réclamation</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message*</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className={`form-control ${errors.message ? 'error' : ''}`}
                  ></textarea>
                  {errors.message && <div className="error-message">{errors.message}</div>}
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary btn-block"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
        
        <div className="map-section">
          <h2>Notre zone de service</h2>
          <div className="map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d168147.2954921176!2d2.3599810866035546!3d48.64993332242285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e5d9d6694856a5%3A0x30b82c3688b2b70!2sEssonne!5e0!3m2!1sfr!2sfr!4v1680123456789!5m2!1sfr!2sfr" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Carte de notre zone de service"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;