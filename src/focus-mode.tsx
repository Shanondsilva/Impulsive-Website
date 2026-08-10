import React from 'react';
import { createRoot } from 'react-dom/client';
import { CurrentInfoPage } from './components/CurrentInfoPage';
import './index.css';
import './lib/darkModeAnimation.css';

const sections = [
  {
    title: 'Focus is supporting functionality',
    paragraphs: [
      'Focus support can help a user reduce distraction and stay with a chosen task, but Impulsive is not positioned as a generic focus timer or productivity app.',
      'The central product proposition remains support during difficult digital habit moments: preparation, short interruption, user choice and cautious learning from later evidence.',
    ],
  },
  {
    title: 'Designed to complement the difficult-moment journey',
    paragraphs: [
      'Focus tools can sit alongside My Moment Plans, short structured interventions, optional protection and later Familiar Steps. They are useful supporting tools rather than the core innovation by themselves.',
    ],
  },
  {
    title: 'No medical claim',
    paragraphs: [
      'Focus support is not a treatment for ADHD, addiction or any other medical or mental-health condition. Impulsive is not a diagnosis or therapy service.',
    ],
  },
];

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CurrentInfoPage
      eyebrow="Focus support"
      title="Focus tools that support, rather than define, Impulsive"
      intro="Focus functionality can help reduce distraction, but the product remains centred on difficult digital habit moments and the next deliberate action."
      sections={sections}
    />
  </React.StrictMode>,
);
