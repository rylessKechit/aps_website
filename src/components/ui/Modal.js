import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Composant Modal réutilisable
 * 
 * @param {Object} props - Propriétés du composant
 * @param {boolean} props.isOpen - État d'ouverture de la modale
 * @param {Function} props.onClose - Fonction de fermeture de la modale
 * @param {React.ReactNode} props.children - Contenu de la modale
 * @param {string} [props.title] - Titre de la modale
 * @param {React.ReactNode} [props.footer] - Pied de la modale
 * @param {boolean} [props.closeOnClickOutside=true] - Fermer la modale en cliquant à l'extérieur
 * @param {boolean} [props.closeOnEsc=true] - Fermer la modale avec la touche Échap
 * @param {string} [props.size='medium'] - Taille de la modale (small, medium, large, full)
 * @param {string} [props.className] - Classes CSS additionnelles
 */
const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  footer,
  closeOnClickOutside = true,
  closeOnEsc = true,
  size = 'medium',
  className = '',
  ...rest
}) => {
  // Référence à l'élément modal
  const modalRef = useRef(null);
  
  // Classes CSS
  const modalClasses = [
    'modal',
    `modal-${size}`,
    className
  ].filter(Boolean).join(' ');
  
  // Animations
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const modalVariants = {
    hidden: { opacity: 0, y: -50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };
  
  // Gestion de la touche Échap
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && closeOnEsc && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Bloquer le scroll sur le body
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Rétablir le scroll sur le body
      document.body.style.overflow = '';
    };
  }, [isOpen, closeOnEsc, onClose]);
  
  // Gestion du clic à l'extérieur de la modale
  const handleOverlayClick = (e) => {
    if (closeOnClickOutside && e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // Créer le portail pour la modale
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.2 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            ref={modalRef}
            className={modalClasses}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3, type: 'spring', damping: 25 }}
            {...rest}
          >
            {title && (
              <div className="modal-header">
                <h3 className="modal-title">{title}</h3>
                <button
                  className="modal-close"
                  onClick={onClose}
                  aria-label="Fermer"
                >
                  <X size={24} />
                </button>
              </div>
            )}
            
            <div className="modal-body">
              {children}
            </div>
            
            {footer && (
              <div className="modal-footer">
                {footer}
              </div>
            )}
            
            {!title && (
              <button
                className="modal-close-icon"
                onClick={onClose}
                aria-label="Fermer"
              >
                <X size={24} />
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

/**
 * Composant d'en-tête de modale
 */
export const ModalHeader = ({ children, className = '', ...rest }) => {
  const headerClasses = ['modal-header', className].filter(Boolean).join(' ');
  
  return (
    <div className={headerClasses} {...rest}>
      {children}
    </div>
  );
};

/**
 * Composant de corps de modale
 */
export const ModalBody = ({ children, className = '', ...rest }) => {
  const bodyClasses = ['modal-body', className].filter(Boolean).join(' ');
  
  return (
    <div className={bodyClasses} {...rest}>
      {children}
    </div>
  );
};

/**
 * Composant de pied de modale
 */
export const ModalFooter = ({ children, className = '', ...rest }) => {
  const footerClasses = ['modal-footer', className].filter(Boolean).join(' ');
  
  return (
    <div className={footerClasses} {...rest}>
      {children}
    </div>
  );
};

export default Modal;