'use client';

import React, { useState } from 'react';
import { ContactFormSchema } from '../schemas';
import { bgMap } from '../engine/Tokens';

export const ContactFormSection: React.FC<any> = (rawProps) => {
  const parseResult = ContactFormSchema.safeParse(rawProps);

  if (!parseResult.success) {
    return (
      <div className="p-4 border border-red-500 bg-red-50 text-red-700">
        <h3>Contact Form Component Configuration Error</h3>
        <pre className="text-xs">{JSON.stringify(parseResult.error.format(), null, 2)}</pre>
      </div>
    );
  }

  const props = parseResult.data;
  const bgClass = bgMap[props.theme];
  const [formState, setFormState] = useState<Record<string, any>>(
    Object.fromEntries((props.fields || []).map((f) => [f.name, f.defaultValue ?? '']))
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const resolvePath = (obj: any, path: string) => {
    return path.split('.').reduce((acc: any, key: string) => (acc ? acc[key] : undefined), obj);
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);

    const missingRequired = (props.fields || []).find(
      (f) => f.required && !String(formState[f.name] ?? '').trim()
    );
    if (missingRequired) {
      setErrorText(`${missingRequired.label || missingRequired.name} is required.`);
      return;
    }

    if (!props.api) {
      setDone(true);
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

      setDone(true);
    } catch (err: any) {
      setErrorText(err?.message || 'Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={`w-full py-16 lg:py-24 ${bgClass}`}>
      <div className="container px-4 mx-auto md:px-6">
        <div className="max-w-xl mx-auto text-left">
          {props.title && (
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">{props.title}</h2>
          )}
          {props.description && <p className="text-lg opacity-80 mb-8">{props.description}</p>}

          {done ? (
            <p className="text-green-700 dark:text-green-400 font-medium">Thank you — your message was sent.</p>
          ) : (
            <form onSubmit={submitForm} className="space-y-4">
              {(props.fields || []).map((field) => {
                const value = formState[field.name] ?? '';
                return (
                  <div key={field.id || field.name} className={field.wrapperClassName || ''}>
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
                        className={`w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 ${field.inputClassName || ''}`.trim()}
                        value={value}
                        onChange={(ev) =>
                          setFormState((prev) => ({ ...prev, [field.name]: ev.target.value }))
                        }
                        rows={4}
                      />
                    ) : (
                      <input
                        id={field.id || field.name}
                        name={field.name}
                        type={field.type}
                        required={field.required}
                        placeholder={field.placeholder}
                        className={`w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 ${field.inputClassName || ''}`.trim()}
                        value={value}
                        onChange={(ev) =>
                          setFormState((prev) => ({ ...prev, [field.name]: ev.target.value }))
                        }
                      />
                    )}
                  </div>
                );
              })}

              {errorText ? <p className="text-sm text-red-600">{errorText}</p> : null}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-lg px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {submitting ? 'Sending…' : props.submitButtonText}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
