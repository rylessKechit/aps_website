import React, { forwardRef } from 'react';

/**
 * Composant Input réutilisable
 * 
 * @param {Object} props - Propriétés du composant
 * @param {string} [props.type='text'] - Type de l'input
 * @param {string} props.id - ID de l'input
 * @param {string} props.name - Nom de l'input
 * @param {string} [props.value] - Valeur de l'input
 * @param {Function} [props.onChange] - Fonction appelée lors du changement
 * @param {string} [props.label] - Label de l'input
 * @param {string} [props.placeholder] - Placeholder de l'input
 * @param {boolean} [props.required=false] - Si l'input est requis
 * @param {boolean} [props.disabled=false] - Si l'input est désactivé
 * @param {boolean} [props.readOnly=false] - Si l'input est en lecture seule
 * @param {string} [props.error] - Message d'erreur
 * @param {Object} [props.startIcon] - Icône à gauche de l'input
 * @param {Object} [props.endIcon] - Icône à droite de l'input
 * @param {string} [props.helperText] - Texte d'aide
 * @param {string} [props.className] - Classes CSS additionnelles
 */
const Input = forwardRef(({
  type = 'text',
  id,
  name,
  value,
  onChange,
  label,
  placeholder,
  required = false,
  disabled = false,
  readOnly = false,
  error,
  startIcon,
  endIcon,
  helperText,
  className = '',
  ...rest
}, ref) => {
  // Classes CSS
  const inputContainerClasses = [
    'input-container',
    error ? 'has-error' : '',
    startIcon ? 'has-start-icon' : '',
    endIcon ? 'has-end-icon' : '',
    disabled ? 'is-disabled' : '',
    className
  ].filter(Boolean).join(' ');
  
  const inputClasses = [
    'form-control',
    error ? 'error' : ''
  ].filter(Boolean).join(' ');
  
  return (
    <div className={inputContainerClasses}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      
      <div className="input-wrapper">
        {startIcon && (
          <div className="input-icon input-icon-start">
            {startIcon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          className={inputClasses}
          {...rest}
        />
        
        {endIcon && (
          <div className="input-icon input-icon-end">
            {endIcon}
          </div>
        )}
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {helperText && !error && <div className="helper-text">{helperText}</div>}
    </div>
  );
});

/**
 * Composant Textarea réutilisable
 */
export const Textarea = forwardRef(({
  id,
  name,
  value,
  onChange,
  label,
  placeholder,
  required = false,
  disabled = false,
  readOnly = false,
  error,
  rows = 3,
  helperText,
  className = '',
  ...rest
}, ref) => {
  // Classes CSS
  const inputContainerClasses = [
    'input-container',
    error ? 'has-error' : '',
    disabled ? 'is-disabled' : '',
    className
  ].filter(Boolean).join(' ');
  
  const textareaClasses = [
    'form-control',
    error ? 'error' : ''
  ].filter(Boolean).join(' ');
  
  return (
    <div className={inputContainerClasses}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        rows={rows}
        className={textareaClasses}
        {...rest}
      />
      
      {error && <div className="error-message">{error}</div>}
      {helperText && !error && <div className="helper-text">{helperText}</div>}
    </div>
  );
});

/**
 * Composant Select réutilisable
 */
export const Select = forwardRef(({
  id,
  name,
  value,
  onChange,
  options = [],
  label,
  placeholder,
  required = false,
  disabled = false,
  error,
  helperText,
  className = '',
  ...rest
}, ref) => {
  // Classes CSS
  const selectContainerClasses = [
    'input-container',
    error ? 'has-error' : '',
    disabled ? 'is-disabled' : '',
    className
  ].filter(Boolean).join(' ');
  
  const selectClasses = [
    'form-control',
    error ? 'error' : ''
  ].filter(Boolean).join(' ');
  
  return (
    <div className={selectContainerClasses}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      
      <div className="select-wrapper">
        <select
          ref={ref}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={selectClasses}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="select-arrow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {helperText && !error && <div className="helper-text">{helperText}</div>}
    </div>
  );
});

/**
 * Composant Checkbox réutilisable
 */
export const Checkbox = forwardRef(({
  id,
  name,
  checked,
  onChange,
  label,
  disabled = false,
  error,
  helperText,
  className = '',
  ...rest
}, ref) => {
  // Classes CSS
  const checkboxContainerClasses = [
    'checkbox-container',
    error ? 'has-error' : '',
    disabled ? 'is-disabled' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={checkboxContainerClasses}>
      <div className="checkbox-wrapper">
        <input
          ref={ref}
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="checkbox-input"
          {...rest}
        />
        
        <label htmlFor={id} className="checkbox-label">
          {label}
        </label>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {helperText && !error && <div className="helper-text">{helperText}</div>}
    </div>
  );
});

/**
 * Composant Radio réutilisable
 */
export const Radio = forwardRef(({
  id,
  name,
  value,
  checked,
  onChange,
  label,
  disabled = false,
  error,
  helperText,
  className = '',
  ...rest
}, ref) => {
  // Classes CSS
  const radioContainerClasses = [
    'radio-container',
    error ? 'has-error' : '',
    disabled ? 'is-disabled' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={radioContainerClasses}>
      <div className="radio-wrapper">
        <input
          ref={ref}
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="radio-input"
          {...rest}
        />
        
        <label htmlFor={id} className="radio-label">
          {label}
        </label>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {helperText && !error && <div className="helper-text">{helperText}</div>}
    </div>
  );
});

Input.displayName = 'Input';
Textarea.displayName = 'Textarea';
Select.displayName = 'Select';
Checkbox.displayName = 'Checkbox';
Radio.displayName = 'Radio';

export default Input;