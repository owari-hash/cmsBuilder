'use client';

import React, { useEffect, useState } from 'react';
import { ModalSchema } from '../schemas';
import { bgMap } from '../engine/Tokens';

const sizeClassMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[95vw]'
} as const;

export const Modal: React.FC<any> = (rawProps) => {
  const parseResult = ModalSchema.safeParse(rawProps);

  if (!parseResult.success) {
    return (
      <div className="p-4 border border-red-500 bg-red-50 text-red-700">
        <h3>Modal Component Configuration Error</h3>
        <pre className="text-xs">{JSON.stringify(parseResult.error.format(), null, 2)}</pre>
      </div>
    );
  }

  const props = parseResult.data;
  const [open, setOpen] = useState(props.defaultOpen);
  const [submitting, setSubmitting] = useState(false);
  const [formState, setFormState] = useState<Record<string, any>>(
    Object.fromEntries((props.fields || []).map((f) => [f.name, f.defaultValue ?? '']))
  );
  const [errorText, setErrorText] = useState<string | null>(null);
  const bgClass = bgMap[props.theme];
  const sizeClass = sizeClassMap[props.size];

  const close = () => {
    if (props.closable) setOpen(false);
  };

  const resolvePath = (obj: any, path: string) => {
    return path.split('.').reduce((acc: any, key: string) => (acc ? acc[key] : undefined), obj);
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);

    const missingRequired = (props.fields || []).find((f) => f.required && !String(formState[f.name] ?? '').trim());
    if (missingRequired) {
      setErrorText(`${missingRequired.label || missingRequired.name} is required.`);
      return;
    }

    if (!props.api) {
      if (props.closeOnSuccess) close();
      return;
    }

    const headers = { ...(props.api.headers || {}) };
    let body: BodyInit | undefined;
    const payload = { ...(props.api.staticBody || {}), ...formState };

    if (props.api.bodyType === 'form') {
      const form = new URLSearchParams();
      Object.entries(payload).forEach(([k, v]) => form.append(k, String(v ?? '')));
      body = form;
      if (!headers['Content-Type']) headers['Content-Type'] = 'application/x-www-form-urlencoded';
    } else if (props.api.method !== 'GET') {
      body = JSON.stringify(payload);
      if (!headers['Content-Type']) headers['Content-Type'] = 'application/json';
    }

    try {
      setSubmitting(true);
      const res = await fetch(props.api.url, {
        method: props.api.method,
        headers,
        body: props.api.method === 'GET' ? undefined : body,
        credentials: props.api.credentials
      });

      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }

      let json: any = null;
      try {
        json = await res.json();
      } catch (_) {
        json = null;
      }

      if (json && props.api.tokenPath && typeof window !== 'undefined') {
        const tokenValue = resolvePath(json, props.api.tokenPath);
        if (tokenValue) localStorage.setItem(props.api.tokenStorageKey || 'auth_token', String(tokenValue));
      }

      if (props.api.redirectTo && typeof window !== 'undefined') {
        window.location.href = props.api.redirectTo;
        return;
      }

      if (props.closeOnSuccess) close();
    } catch (err: any) {
      setErrorText(err?.message || 'Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ type: string; targetId?: string }>;
      const detail = custom.detail || {};
      if (!props.id || detail.targetId !== props.id) return;

      if (detail.type === 'openModal') setOpen(true);
      if (detail.type === 'closeModal') setOpen(false);
      if (detail.type === 'toggleModal') setOpen((prev) => !prev);
    };

    window.addEventListener('cms:modal', handler as EventListener);
    return () => window.removeEventListener('cms:modal', handler as EventListener);
  }, [props.id]);

  return (
    <div className={`w-full ${props.className || ''}`.trim()}>
      {!open && props.showTrigger ? (
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          onClick={() => setOpen(true)}
        >
          {props.openButtonText}
        </button>
      ) : null}

      {open ? (
        <div
          className={`fixed inset-0 ${props.overlayClassName || 'bg-black/50'} flex ${props.centered ? 'items-center' : 'items-start pt-24'} justify-center p-4`}
          style={{ zIndex: props.zIndex }}
          onClick={(e) => {
            if (props.closeOnBackdrop && e.target === e.currentTarget) {
              close();
            }
          }}
        >
          <div className={`w-full ${sizeClass} rounded-xl border shadow-2xl ${bgClass}`}>
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{props.title}</h3>
              {props.closable ? (
                <button
                  type="button"
                  className="rounded-md px-2 py-1 text-sm opacity-70 hover:opacity-100"
                  onClick={close}
                >
                  ✕
                </button>
              ) : null}
            </div>

            <div className="p-5 whitespace-pre-wrap">{props.content}</div>

            {props.modalType === 'formModal' ? (
              <form className={`p-5 pt-0 ${props.formClassName || ''}`.trim()} onSubmit={submitForm}>
                <div className={props.formLayoutClassName}>
                  {(props.fields || []).map((field) => {
                    const value = formState[field.name] ?? '';
                    const wrapperStyle = (field.style || {}) as React.CSSProperties;

                    return (
                      <div
                        key={field.id || field.name}
                        className={field.wrapperClassName || ''}
                        style={wrapperStyle}
                      >
                        {field.label ? (
                          <label className="block text-sm font-medium mb-1" htmlFor={field.id || field.name}>
                            {field.label}
                          </label>
                        ) : null}
                        {field.type === 'textarea' ? (
                          <textarea
                            id={field.id || field.name}
                            name={field.name}
                            required={field.required}
                            placeholder={field.placeholder}
                            className={`w-full border rounded-lg px-3 py-2 ${field.inputClassName || ''}`.trim()}
                            value={value}
                            onChange={(ev) => setFormState((prev) => ({ ...prev, [field.name]: ev.target.value }))}
                          />
                        ) : (
                          <input
                            id={field.id || field.name}
                            name={field.name}
                            type={field.type}
                            required={field.required}
                            placeholder={field.placeholder}
                            className={`w-full border rounded-lg px-3 py-2 ${field.inputClassName || ''}`.trim()}
                            value={value}
                            onChange={(ev) => setFormState((prev) => ({ ...prev, [field.name]: ev.target.value }))}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {errorText ? (
                  <p className="mt-3 text-sm text-red-600">{errorText}</p>
                ) : null}

                <div className="mt-4 flex items-center justify-end gap-2">
                  {props.closable ? (
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-lg px-4 py-2 border hover:bg-gray-100/20 transition-colors"
                      onClick={close}
                    >
                      {props.cancelButtonText}
                    </button>
                  ) : null}
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-lg px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : props.submitButtonText}
                  </button>
                </div>
              </form>
            ) : null}

            {props.showFooter && props.modalType !== 'formModal' ? (
              <div className="p-4 border-t flex items-center justify-end gap-2">
                {props.confirmButtonText ? (
                  props.confirmHref ? (
                    <a
                      href={props.confirmHref}
                      className="inline-flex items-center justify-center rounded-lg px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      {props.confirmButtonText}
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-lg px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      {props.confirmButtonText}
                    </button>
                  )
                ) : null}
                {props.closable ? (
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-lg px-4 py-2 border hover:bg-gray-100/20 transition-colors"
                    onClick={close}
                  >
                    {props.closeButtonText}
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Modal;
