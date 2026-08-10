import React from 'react';
import { createRoot } from 'react-dom/client';
import { CurrentInfoPage } from './components/CurrentInfoPage';
import './index.css';
import './lib/darkModeAnimation.css';

const sections = [
  {
    title: 'Current Android product',
    paragraphs: [
      'Impulsive has launched through Google Play for Android. Availability can depend on the Google Play release or testing access that applies to a particular account or region.',
      'The product is designed for adults who want to interrupt difficult digital habit moments, create space before acting and build a more deliberate response over time.',
    ],
  },
  {
    title: 'My Moment Plans and Familiar Steps',
    paragraphs: [
      'A My Moment Plan lets a user prepare a clear next step in advance. Impulsive preserves the relevant plan revision so later evidence can refer to the content that was actually prepared.',
      'A Familiar Step is not a favourite or a one-off recommendation. It becomes eligible only after enough comparable favourable history exists. Insufficient, stale, unsupported or unsuitable evidence falls back instead of forcing a personal suggestion.',
    ],
  },
  {
    title: 'Short interventions and protection',
    paragraphs: [
      'Impulsive can use short structured interventions, prepared plans, reset content and brief attention-shifting activities to create space during a difficult moment.',
      'Optional app and website protection can add friction around selected digital triggers. Protection supports the wider behaviour-change journey rather than defining the whole product.',
    ],
  },
  {
    title: 'Private history and optional recovery',
    paragraphs: [
      'Sensitive behavioural and recovery information is stored locally on the device by default. Recommendation, actual user choice, lifecycle state, immediate feedback and later observation are kept distinct so the app does not treat a suggestion or a click as proof that something worked.',
      'Eligible users can choose optional encrypted recovery. Account, subscription, integrity and diagnostic services process limited information where needed. The current Privacy Policy explains the exact data flows.',
    ],
  },
  {
    title: 'What Impulsive does not claim',
    paragraphs: [
      'Impulsive is not a medical device, therapy service, diagnosis tool, crisis-support service or clinically validated treatment. It does not claim clinical efficacy or guaranteed behaviour change.',
    ],
  },
];

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CurrentInfoPage
      eyebrow="Impulsive for Android"
      title="A private pause before the habit takes over"
      intro="The current product combines preparation, short intervention, user choice, cautious personal history and optional protection to support difficult digital habit moments."
      sections={sections}
    />
  </React.StrictMode>,
);
