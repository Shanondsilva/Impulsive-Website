import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AlertTriangle, LockKeyhole } from 'lucide-react';
import { AccountDeletionLayout } from './components/AccountDeletionLayout';
import './index.css';
import './lib/darkModeAnimation.css';

type ViteImportMeta = ImportMeta & {
  env?: Record<string, string | undefined>;
};

type FormStatus = {
  message: string;
  type: 'success' | 'error' | '';
};

const TURNSTILE_SITE_KEY = ((import.meta as ViteImportMeta).env?.VITE_TURNSTILE_SITE_KEY ?? '').trim();
const TURNSTILE_NOT_CONFIGURED_MESSAGE = 'The account deletion security check is not configured yet. Please try again later.';

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, params: { sitekey: string }) => string;
      getResponse: (widgetId: string) => string | undefined;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

function DeleteAccountPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<FormStatus>({ message: '', type: '' });

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;

    const scriptId = 'cf-turnstile-script';
    const renderWidget = () => {
      if (turnstileContainerRef.current && window.turnstile && turnstileWidgetIdRef.current === null) {
        turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
        });
      }
    };

    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      renderWidget();
    } else {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      document.head.appendChild(script);
    }

    return () => {
      if (turnstileWidgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(turnstileWidgetIdRef.current);
        turnstileWidgetIdRef.current = null;
      }
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const email = String(formData.get('email') || '').trim();
    if (!email || email.length > 254 || !email.includes('@')) {
      setFormStatus({ message: 'Please enter a valid email address.', type: 'error' });
      return;
    }

    if (!TURNSTILE_SITE_KEY) {
      setFormStatus({ message: TURNSTILE_NOT_CONFIGURED_MESSAGE, type: 'error' });
      return;
    }

    const turnstileToken = turnstileWidgetIdRef.current !== null
      ? (window.turnstile?.getResponse(turnstileWidgetIdRef.current) ?? '')
      : '';

    if (!turnstileToken) {
      setFormStatus({ message: 'Please complete the security check.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setFormStatus({ message: '', type: '' });
    try {
      const response = await fetch('/api/delete-account/request', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, turnstileToken }),
      });
      const result = await response.json() as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(result.error || 'We could not send a confirmation link right now. Please try again.');
      }

      formRef.current.reset();
      setFormStatus({
        message: result.message || "If that email has an Impulsive account, we've sent a confirmation link.",
        type: 'success',
      });
    } catch (error) {
      setFormStatus({
        message: error instanceof Error ? error.message : 'We could not send a confirmation link right now. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
      if (turnstileWidgetIdRef.current !== null && window.turnstile) {
        window.turnstile.reset(turnstileWidgetIdRef.current);
      }
    }
  };

  return (
    <AccountDeletionLayout>
      <main id="main" className="account-deletion-main">
        <div className="hero-bg" aria-hidden="true">
          <span className="shape shape-lilac" />
          <span className="shape shape-blue" />
          <span className="shape shape-coral" />
        </div>
        <section className="container account-deletion-grid" aria-labelledby="delete-account-title">
          <div className="account-deletion-copy">
            <p className="eyebrow">Account and privacy</p>
            <h1 id="delete-account-title">Delete your Impulsive account</h1>
            <p className="account-deletion-lead">
              Request a secure confirmation link to permanently erase your Impulsive account and all data associated with it.
            </p>
            <div className="account-deletion-warning">
              <AlertTriangle aria-hidden="true" />
              <div>
                <h2>This cannot be undone</h2>
                <p>Your account, journal entries, checklists, recovery sessions, sync data, and subscription records will be permanently deleted.</p>
              </div>
            </div>
          </div>

          <div className="account-deletion-card">
            <div className="account-deletion-card-heading">
              <span className="account-deletion-icon" aria-hidden="true"><LockKeyhole /></span>
              <div>
                <p className="eyebrow">Secure request</p>
                <h2>Send confirmation link</h2>
              </div>
            </div>
            <p>Enter the email address used for your Impulsive account. The link will expire after 1 hour.</p>
            <form ref={formRef} className="account-deletion-form" onSubmit={handleSubmit}>
              <label htmlFor="deletion-email">Account email</label>
              <input
                id="deletion-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                maxLength={254}
                required
              />
              <div className="account-deletion-turnstile" ref={turnstileContainerRef} />
              <button className="button account-deletion-submit" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
                {isSubmitting ? (
                  <><span className="button-spinner" aria-hidden="true" /><span>Sending...</span></>
                ) : 'Send confirmation link'}
              </button>
              {formStatus.message && (
                <p className="form-note" data-state={formStatus.type} role={formStatus.type === 'error' ? 'alert' : 'status'}>
                  {formStatus.message}
                </p>
              )}
            </form>
            <p className="account-deletion-help">Need help? Email <a href="mailto:contact@useimpulsive.com">contact@useimpulsive.com</a>.</p>
          </div>
        </section>
      </main>
    </AccountDeletionLayout>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DeleteAccountPage />
  </React.StrictMode>,
);
