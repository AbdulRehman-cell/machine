import React from 'react';

/**
 * UI Components for AMI E-Commerce Platform.
 * Exports Button, Spinner, Alert, Badge as requested by page components.
 */

export function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  disabled = false, 
  className = '', 
  ...props 
}) {
  // Map our design system button classes
  let btnClass = 'btn-primary';
  if (variant === 'secondary') {
    btnClass = 'btn-secondary';
  } else if (variant === 'ghost') {
    btnClass = 'btn-ghost';
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${btnClass} ${className}`}
      style={{
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.18s ease-in-out'
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function Spinner({ className = '', ...props }) {
  return (
    <div 
      className={`spinner-container ${className}`} 
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '1rem',
        width: '100%'
      }} 
      {...props}
    >
      <div 
        className="spinner" 
        style={{
          width: '2.5rem',
          height: '2.5rem',
          border: '3px solid rgba(var(--primary-rgb, 224, 86, 36), 0.15)',
          borderTopColor: 'var(--primary, #e05624)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}
      />
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}

export function Alert({ 
  children, 
  variant = 'error', 
  className = '', 
  ...props 
}) {
  // Map alert types to the design system classes
  const alertClass = variant === 'success' 
    ? 'alert alert-success' 
    : variant === 'info' 
    ? 'alert alert-info' 
    : 'alert alert-error';

  return (
    <div 
      className={`${alertClass} ${className}`} 
      style={{ 
        margin: '1rem 0',
        padding: '1rem',
        borderRadius: '6px',
        borderLeft: '4px solid currentColor'
      }} 
      {...props}
    >
      {children}
    </div>
  );
}

export function Badge({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: 'rgba(34, 197, 94, 0.15)',
          color: '#22c55e',
          border: '1px solid rgba(34, 197, 94, 0.3)'
        };
      case 'secondary':
        return {
          backgroundColor: 'rgba(100, 116, 139, 0.15)',
          color: '#94a3b8',
          border: '1px solid rgba(100, 116, 139, 0.3)'
        };
      case 'warning':
        return {
          backgroundColor: 'rgba(234, 179, 8, 0.15)',
          color: '#eab308',
          border: '1px solid rgba(234, 179, 8, 0.3)'
        };
      default:
        return {
          backgroundColor: 'rgba(224, 86, 36, 0.15)',
          color: '#e05624',
          border: '1px solid rgba(224, 86, 36, 0.3)'
        };
    }
  };

  return (
    <span 
      className={`badge ${className}`} 
      style={{
        display: 'inline-block',
        padding: '0.25rem 0.6rem',
        fontSize: '0.75rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        borderRadius: '9999px',
        ...getBadgeStyle()
      }}
      {...props}
    >
      {children}
    </span>
  );
}