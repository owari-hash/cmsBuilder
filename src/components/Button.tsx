import React from 'react';
import { ButtonToken } from '../schemas';

export const buttonVariantMap: Record<NonNullable<ButtonToken['variant']>, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm border border-transparent",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-transparent",
  outline: "bg-transparent text-current border border-current hover:bg-gray-100/10",
  ghost: "bg-transparent text-current border border-transparent hover:bg-gray-100/10"
};

export const buttonSizeMap: Record<NonNullable<ButtonToken['size']>, string> = {
  sm: "h-8 px-4 text-xs",
  md: "h-10 px-6 text-sm",
  lg: "h-12 px-8 text-base"
};

export const Button: React.FC<ButtonToken> = (props) => {
  const variantClass = buttonVariantMap[props.variant || 'primary'];
  const sizeClass = buttonSizeMap[props.size || 'md'];
  
  const className = `inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variantClass} ${sizeClass}`;

  if (props.href) {
    return (
      <a href={props.href} className={className}>
        {props.text}
      </a>
    );
  }

  return (
    <button className={className}>
      {props.text}
    </button>
  );
};
