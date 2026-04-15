'use client';

import { InputHTMLAttributes, ReactNode } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  helperText?: string;
}

/**
 * Reusable Input Component
 * 
 * Features:
 * - Consistent styling across app
 * - Built-in label support
 * - Icon support (for left-side icons)
 * - Error message display
 * - Helper text
 * - Proper placeholder handling
 * 
 * Usage:
 * <FormInput
 *   label="Email"
 *   type="email"
 *   placeholder="you@email.com"
 *   value={email}
 *   onChange={e => setEmail(e.target.value)}
 *   icon={<FiMail size={15} />}
 *   error={emailError}
 *   required
 * />
 */
export default function FormInput({
  label,
  error,
  icon,
  helperText,
  placeholder,
  className = '',
  type = 'text',
  ...props
}: FormInputProps) {
  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input wrapper with icon support */}
      <div className="relative">
        {/* Left icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            {icon}
          </div>
        )}

        {/* Input element */}
        <input
          type={type}
          placeholder={placeholder || ''}
          className={`input-dark ${
            icon ? 'pl-10' : ''
          } ${
            error ? 'border-red-500' : ''
          } ${
            className
          }`}
          {...props}
        />

        {/* Optional right icon for password visibility toggle */}
        {props.children}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}

      {/* Helper text */}
      {helperText && !error && (
        <p className="text-xs text-gray-600 mt-1">
          {helperText}
        </p>
      )}
    </div>
  );
}
