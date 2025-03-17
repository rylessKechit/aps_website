import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Composant Button réutilisable
 * 
 * @param {Object} props - Propriétés du composant
 * @param {string} [props.variant='primary'] - Variante du bouton (primary, outline, text)
 * @param {string} [props.size='medium'] - Taille du bouton (small, medium, large)
 * @param {boolean} [props.fullWidth=false] - Si le bouton doit prendre toute la largeur
 * @param {boolean} [props.disabled=false] - Si le bouton est désactivé
 * @param {Function} [props.onClick] - Fonction appelée au clic
 * @param {string} [props.type='button'] - Type du bouton (button, submit, reset)
 * @param {string} [props.to] - URL de destination (si bouton est un lien)
 * @param {boolean} [props.isExternal=false] - Si le lien est externe
 * @param {React.ReactNode} props.children - Contenu du bouton
 * @param {Object} [props.startIcon] - Icône à gauche du texte
 * @param {Object} [props.endIcon] - Icône à droite du texte
 * @param {string} [props.className] - Classes CSS additionnelles
 */
const Button = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  to,
  isExternal = false,
  children,
  startIcon,
  endIcon,
  className = '',
  ...rest
}) => {
  // Classes CSS
  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'btn-block' : '',
    disabled ? 'btn-disabled' : '',
    className
  ].filter(Boolean).join(' ');
  
  // Si c'est un lien externe
  if (to && isExternal) {
    return (
      <a
        href={to}
        className={buttonClasses}
        target="_blank"
        rel="noopener noreferrer"
        {...rest}
      >
        {startIcon && <span className="btn-icon btn-icon-start">{startIcon}</span>}
        {children}
        {endIcon && <span className="btn-icon btn-icon-end">{endIcon}</span>}
      </a>
    );
  }
  
  // Si c'est un lien interne
  if (to) {
    return (
      <Link
        to={to}
        className={buttonClasses}
        {...rest}
      >
        {startIcon && <span className="btn-icon btn-icon-start">{startIcon}</span>}
        {children}
        {endIcon && <span className="btn-icon btn-icon-end">{endIcon}</span>}
      </Link>
    );
  }
  
  // Sinon c'est un bouton
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {startIcon && <span className="btn-icon btn-icon-start">{startIcon}</span>}
      {children}
      {endIcon && <span className="btn-icon btn-icon-end">{endIcon}</span>}
    </button>
  );
};

export default Button;