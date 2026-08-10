import React from 'react';
import { createRoot } from 'react-dom/client';
import { CurrentInfoPage } from './components/CurrentInfoPage';
import './index.css';
import './lib/darkModeAnimation.css';

const sections = [
  {
    title: 'Private by default, not privacy as a slogan',
    paragraphs: [
      'Impulsive is designed for sensitive difficult habit moments, so behavioural and recovery information is stored locally on the device by default.',
      'Privacy is an architectural constraint and a user-value decision. It is not presented as proof that Impulsive is medically effective or as the sole reason the product is innovative.',
    ],
  },
  {
    title: 'What can leave the device',
    paragraphs: [
      'Features a user chooses to use can involve limited off-device processing. Current examples include account authentication, subscription verification, app-integrity checks, crash diagnostics and optional encrypted cloud recovery.',
      'Eligible users can enable encrypted recovery. Depending on the eligible account path, the encrypted recovery copy can use the Impulsive app-data area of Google Drive or Firebase Storage. This is separate from ordinary local behavioural storage.',
    ],
  },
  {
    title: 'Protection features',
    paragraphs: [
      'Optional app protection can use Android Usage Access locally to recognise selected foreground apps. Optional Website Protection can use Android’s VPN framework for on-device DNS filtering.',
      'The public Privacy Policy explains the current service providers, deletion routes and data flows in more detail.',
    ],
  },
  {
    title: 'No clinical claim',
    paragraphs: [
      'Impulsive is a behaviour-change support tool for adults. It is not therapy, medical treatment, diagnosis, crisis support or a clinically validated treatment.',
    ],
  },
];

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CurrentInfoPage
      eyebrow="Private behaviour-change support"
      title="Sensitive support without turning private history into a public score"
      intro="Impulsive is designed to keep the most sensitive behavioural information on the device by default while clearly separating optional services that require off-device processing."
      sections={sections}
    />
  </React.StrictMode>,
);
