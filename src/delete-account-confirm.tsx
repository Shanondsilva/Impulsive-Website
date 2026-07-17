import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import Lottie from 'lottie-react';
import loadingAnimation from './assets/loading.json';
import { AccountDeletionLayout } from './components/AccountDeletionLayout';
import './index.css';
import './lib/darkModeAnimation.css';

type ConfirmationState = {
  status: 'loading' | 'success' | 'error';
  message: string;
};

const deletionCompletedSessionKey = 'impulsive-account-deletion-completed';

function DeleteAccountConfirmPage() {
  const startedRef = useRef(false);
  const [confirmation, setConfirmation] = useState<ConfirmationState>({
    status: 'loading',
    message: 'Securely deleting your account and data...',
  });

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const token = new URLSearchParams(window.location.search).get('token')?.trim() || '';
    window.history.replaceState({}, document.title, '/delete-account/confirm');

    if (!token) {
      if (sessionStorage.getItem(deletionCompletedSessionKey)) {
        setConfirmation({
          status: 'success',
          message: 'Your Impulsive account and data have been permanently deleted.',
        });
        return;
      }

      setConfirmation({ status: 'error', message: 'This deletion link is invalid or incomplete.' });
      return;
    }

    const confirmDeletion = async () => {
      try {
        const response = await fetch('/api/delete-account/confirm', {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const result = await response.json() as { message?: string; error?: string };

        if (!response.ok) {
          throw new Error(result.error || 'Could not complete deletion. Please try again or email hello@useimpulsive.com.');
        }

        sessionStorage.setItem(deletionCompletedSessionKey, 'true');
        setConfirmation({
          status: 'success',
          message: result.message || 'Your Impulsive account and data have been permanently deleted.',
        });
      } catch (error) {
        setConfirmation({
          status: 'error',
          message: error instanceof Error
            ? error.message
            : 'Could not complete deletion. Please try again or email hello@useimpulsive.com.',
        });
      }
    };

    void confirmDeletion();
  }, []);

  const Icon = confirmation.status === 'success'
    ? CheckCircle2
    : AlertCircle;

  return (
    <AccountDeletionLayout>
      <main id="main" className="account-deletion-main account-deletion-confirm-main">
        <div className="hero-bg" aria-hidden="true">
          <span className="shape shape-lilac" />
          <span className="shape shape-blue" />
          <span className="shape shape-coral" />
        </div>
        <section className="container account-deletion-confirm-card" aria-labelledby="confirmation-title">
          {confirmation.status === 'loading' ? (
            <div className="account-deletion-lottie" aria-hidden="true">
              <Lottie
                animationData={loadingAnimation}
                loop
                autoplay
              />
            </div>
          ) : (
            <span className={`account-deletion-result-icon account-deletion-result-icon--${confirmation.status}`} aria-hidden="true">
              <Icon className="" />
            </span>
          )}
          <p className="eyebrow">Account deletion</p>
          <h1 id="confirmation-title">
            {confirmation.status === 'loading' && 'Completing your request'}
            {confirmation.status === 'success' && 'Your account has been deleted'}
            {confirmation.status === 'error' && 'We could not complete the request'}
          </h1>
          <p
            className="account-deletion-result-message"
            role={confirmation.status === 'error' ? 'alert' : 'status'}
            aria-live="polite"
          >
            {confirmation.message}
          </p>
          {confirmation.status !== 'loading' && (
            <div className="account-deletion-result-actions">
              <a className="button" href="/">Back to home</a>
              {confirmation.status === 'error' && (
                <a className="button button-secondary" href="mailto:contact@useimpulsive.com">Email support</a>
              )}
            </div>
          )}
        </section>
      </main>
    </AccountDeletionLayout>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DeleteAccountConfirmPage />
  </React.StrictMode>,
);
