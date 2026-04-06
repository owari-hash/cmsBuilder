'use client';

import React, { useState } from 'react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const variantClass = buttonVariantMap[props.variant || 'primary'];
  const sizeClass = buttonSizeMap[props.size || 'md'];
  const fullWidthClass = props.fullWidth ? 'w-full' : '';
  const className = [
    'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    variantClass,
    sizeClass,
    fullWidthClass,
    props.className || ''
  ].join(' ').trim();

  const inlineStyle = (props.style || {}) as React.CSSProperties;
  const anchorRel = props.rel || (props.target === '_blank' ? 'noopener noreferrer' : undefined);

  const resolvePath = (obj: any, path: string) => {
    return path.split('.').reduce((acc: any, key: string) => (acc ? acc[key] : undefined), obj);
  };

  const runApiAction = async () => {
    if (!props.api) return;

    const { api } = props;
    const headers = { ...(api.headers || {}) };
    let body: BodyInit | undefined;

    if (api.bodyType === 'form') {
      const params = new URLSearchParams();
      Object.entries(api.body || {}).forEach(([k, v]) => params.append(k, String(v)));
      body = params;
      if (!headers['Content-Type']) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
      }
    } else if (api.body && api.method !== 'GET') {
      body = JSON.stringify(api.body);
      if (!headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
      }
    }

    const response = await fetch(api.url, {
      method: api.method,
      headers,
      body: api.method === 'GET' ? undefined : body,
      credentials: api.credentials
    });

    if (!response.ok) {
      throw new Error(`API action "${api.type}" failed with status ${response.status}`);
    }

    let responseJson: any = null;
    try {
      responseJson = await response.json();
    } catch (_) {
      responseJson = null;
    }

    if (responseJson && api.tokenPath) {
      const tokenValue = resolvePath(responseJson, api.tokenPath);
      if (tokenValue && typeof window !== 'undefined') {
        localStorage.setItem(api.tokenStorageKey || 'auth_token', String(tokenValue));
      }
    }

    const successStrategy = api.onSuccess?.strategy || (api.redirectTo || props.href ? 'redirect' : 'none');
    const successMessage = api.onSuccess?.message;
    if (successMessage && typeof window !== 'undefined') {
      console.info(`[Button:${api.type}] ${successMessage}`);
    }

    if (typeof window !== 'undefined') {
      if (successStrategy === 'reload') {
        window.location.reload();
      } else if (successStrategy === 'redirect') {
        const redirectTarget = api.redirectTo || props.href;
        if (redirectTarget) {
          window.location.href = redirectTarget;
        }
      }
    }
  };

  const onActivate = async (e: React.MouseEvent<HTMLElement>) => {
    if (props.disabled || isSubmitting) {
      e.preventDefault();
      return;
    }

    if (props.action) {
      if (props.action.preventDefault) e.preventDefault();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cms:modal', {
          detail: {
            type: props.action.type,
            targetId: props.action.targetId
          }
        }));
      }
      return;
    }

    if (!props.api) return;

    e.preventDefault();
    try {
      setIsSubmitting(true);
      await runApiAction();
    } catch (error) {
      console.error('[Button] api action error:', error);
      if (props.api?.onError?.strategy === 'alert') {
        const message = props.api?.onError?.message || 'Request failed. Please try again.';
        if (typeof window !== 'undefined') {
          window.alert(message);
        }
      } else if (props.api?.onError?.strategy === 'toast') {
        const message = props.api?.onError?.message || 'Request failed. Please try again.';
        if (typeof window !== 'undefined') {
          console.warn(`[Button:${props.api.type}] ${message}`);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderButton = () => {
    if (props.href) {
      return (
        <a
          id={props.id}
          href={props.href}
          className={className}
          style={inlineStyle}
          target={props.target}
          rel={anchorRel}
          aria-label={props.ariaLabel}
          aria-disabled={props.disabled ? true : undefined}
          onClick={onActivate}
        >
          {isSubmitting ? (props.loadingText || 'Loading...') : props.text}
        </a>
      );
    }

    return (
      <button
        id={props.id}
        className={className}
        style={inlineStyle}
        aria-label={props.ariaLabel}
        disabled={props.disabled || isSubmitting}
        type={props.type || 'button'}
        onClick={onActivate as any}
      >
        {isSubmitting ? (props.loadingText || 'Loading...') : props.text}
      </button>
    );
  };

  if (props.centered) {
    const centeredClass = props.centerMode === 'viewport'
      ? 'fixed inset-0 z-40 flex items-center justify-center pointer-events-none'
      : 'w-full flex items-center justify-center';

    return (
      <div className={`${centeredClass} ${props.containerClassName || ''}`.trim()}>
        <div className="pointer-events-auto">
          {renderButton()}
        </div>
      </div>
    );
  }

  const alignClass = props.align === 'center'
    ? 'w-full flex justify-center'
    : props.align === 'right'
      ? 'w-full flex justify-end'
      : '';

  if (alignClass || props.containerClassName) {
    return (
      <div className={`${alignClass} ${props.containerClassName || ''}`.trim()}>
        {renderButton()}
      </div>
    );
  }

  return renderButton();
};
