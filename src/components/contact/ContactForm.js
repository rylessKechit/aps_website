import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Input, { Textarea, Select } from '../ui/Input';
import Button from '../ui/Button';
import { submitContactForm } from '../../utils/api';

const ContactForm = () => {
  // Contexte global
  const { addNotification } = useApp();
  
  // États
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Schéma de validation
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Veuillez entrer votre nom')
      .min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: Yup.string()
      .email('Veuillez entrer un email valide')
      .required('Veuillez entrer votre email'),
    phone: Yup.string()
      .matches(/^[+\d\s()-]{10,20}$/, 'Veuillez entrer un numéro de téléphone valide')
      .nullable(),
    subject: Yup.string(),
    message: Yup.string()
      .required('Veuillez entrer votre message')
      .min(10, 'Votre message doit contenir au moins 10 caractères')
  });
  
  // Options pour le sujet
  const subjectOptions = [
    { value: '', label: 'Sélectionnez un sujet' },
    { value: 'reservation', label: 'Réservation' },
    { value: 'information', label: 'Demande d\'information' },
    { value: 'reclamation', label: 'Réclamation' },
    { value: 'autre', label: 'Autre' }
  ];
  
  // Initialisation du formulaire avec Formik
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        
        // Envoi du formulaire
        await submitContactForm(values);
        
        // Réinitialisation du formulaire
        formik.resetForm();
        
        // Notification de succès
        addNotification(
          'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
          'success',
          5000
        );
        
        // Affichage du message de confirmation
        setSubmitted(true);
        
        // Masquer le message après 5 secondes
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      } catch (error) {
        console.error('Erreur lors de l\'envoi du formulaire', error);
        
        // Notification d'erreur
        addNotification(
          'Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer.',
          'error',
          5000
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  });
  
  return (
    <div className="contact-form-container">
      <h2>Envoyez-nous un message</h2>
      
      {submitted ? (
        <div className="form-success">
          <div className="success-icon">
            <CheckCircle size={60} color="#4CAF50" />
          </div>
          <h3>Message envoyé avec succès!</h3>
          <p>Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.</p>
          
          <Button 
            variant="outline"
            onClick={() => setSubmitted(false)}
            className="mt-4"
          >
            Envoyer un autre message
          </Button>
        </div>
      ) : (
        <form onSubmit={formik.handleSubmit} className="contact-form">
          <div className="form-row">
            <Input
              type="text"
              id="name"
              name="name"
              label="Nom"
              placeholder="Votre nom"
              required
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && formik.errors.name}
            />
            
            <Input
              type="email"
              id="email"
              name="email"
              label="Email"
              placeholder="Votre email"
              required
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && formik.errors.email}
            />
          </div>
          
          <div className="form-row">
            <Input
              type="tel"
              id="phone"
              name="phone"
              label="Téléphone"
              placeholder="Votre numéro de téléphone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phone && formik.errors.phone}
            />
            
            <Select
              id="subject"
              name="subject"
              label="Sujet"
              options={subjectOptions}
              value={formik.values.subject}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          
          <Textarea
            id="message"
            name="message"
            label="Message"
            placeholder="Votre message"
            required
            rows={5}
            value={formik.values.message}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.message && formik.errors.message}
          />
          
          <Button 
            type="submit" 
            variant="primary"
            disabled={isSubmitting}
            className="btn-block"
            startIcon={isSubmitting ? <span className="loading-spinner"></span> : <Send size={18} />}
          >
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
          </Button>
          
          {Object.keys(formik.errors).length > 0 && formik.touched.name && (
            <div className="form-error general">
              <AlertCircle size={18} />
              <span>Veuillez corriger les erreurs dans le formulaire.</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default ContactForm;