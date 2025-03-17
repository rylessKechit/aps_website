import React from 'react';

/**
 * Composant Card réutilisable
 * 
 * @param {Object} props - Propriétés du composant
 * @param {React.ReactNode} props.children - Contenu de la carte
 * @param {React.ReactNode} [props.header] - En-tête de la carte
 * @param {React.ReactNode} [props.footer] - Pied de la carte
 * @param {string} [props.variant='default'] - Variante de la carte (default, outlined, elevated)
 * @param {boolean} [props.hoverable=false] - Si la carte a un effet au survol
 * @param {string} [props.className] - Classes CSS additionnelles
 */
const Card = ({
  children,
  header,
  footer,
  variant = 'default',
  hoverable = false,
  className = '',
  ...rest
}) => {
  // Classes CSS
  const cardClasses = [
    'card',
    `card-${variant}`,
    hoverable ? 'card-hoverable' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={cardClasses} {...rest}>
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};

/**
 * Composant pour l'en-tête de la carte
 */
export const CardHeader = ({ children, className = '', ...rest }) => {
  const headerClasses = ['card-header', className].filter(Boolean).join(' ');
  
  return (
    <div className={headerClasses} {...rest}>
      {children}
    </div>
  );
};

/**
 * Composant pour le corps de la carte
 */
export const CardBody = ({ children, className = '', ...rest }) => {
  const bodyClasses = ['card-body', className].filter(Boolean).join(' ');
  
  return (
    <div className={bodyClasses} {...rest}>
      {children}
    </div>
  );
};

/**
 * Composant pour le pied de la carte
 */
export const CardFooter = ({ children, className = '', ...rest }) => {
  const footerClasses = ['card-footer', className].filter(Boolean).join(' ');
  
  return (
    <div className={footerClasses} {...rest}>
      {children}
    </div>
  );
};

/**
 * Composant pour le titre de la carte
 */
export const CardTitle = ({ children, className = '', ...rest }) => {
  const titleClasses = ['card-title', className].filter(Boolean).join(' ');
  
  return (
    <h3 className={titleClasses} {...rest}>
      {children}
    </h3>
  );
};

/**
 * Composant pour le sous-titre de la carte
 */
export const CardSubtitle = ({ children, className = '', ...rest }) => {
  const subtitleClasses = ['card-subtitle', className].filter(Boolean).join(' ');
  
  return (
    <h4 className={subtitleClasses} {...rest}>
      {children}
    </h4>
  );
};

/**
 * Composant pour le texte de la carte
 */
export const CardText = ({ children, className = '', ...rest }) => {
  const textClasses = ['card-text', className].filter(Boolean).join(' ');
  
  return (
    <p className={textClasses} {...rest}>
      {children}
    </p>
  );
};

/**
 * Composant pour les actions de la carte
 */
export const CardActions = ({ children, className = '', ...rest }) => {
  const actionsClasses = ['card-actions', className].filter(Boolean).join(' ');
  
  return (
    <div className={actionsClasses} {...rest}>
      {children}
    </div>
  );
};

/**
 * Composant pour l'image de la carte
 */
export const CardImage = ({ src, alt, className = '', ...rest }) => {
  const imageClasses = ['card-image', className].filter(Boolean).join(' ');
  
  return (
    <div className="card-image-container">
      <img src={src} alt={alt} className={imageClasses} {...rest} />
    </div>
  );
};

export default Card;