import React from 'react';
import { createRoot } from 'react-dom/client';
import { CurrentInfoPage } from './components/CurrentInfoPage';
import './index.css';
import './lib/darkModeAnimation.css';

const sections = [
  {
    title: '1. Prepare before the moment',
    paragraphs: [
      'A user can create a My Moment Plan before a difficult moment occurs. The plan gives them a clear next step rather than asking them to invent a response while the habit pull is already strong.',
      'When the behavioural content of a plan changes, Impulsive preserves the relevant revision identity so later history is not silently attributed to a different version of that plan.',
    ],
  },
  {
    title: '2. Create a short pause',
    paragraphs: [
      'At the difficult moment, Impulsive can present an eligible short intervention, a prepared plan or another structured route. Optional app and website protection can add friction around selected digital triggers.',
      'The objective is not endless blocking or entertainment. It is to create enough space for a more deliberate next action.',
    ],
  },
  {
    title: '3. Keep recommendation and choice separate',
    paragraphs: [
      'Impulsive distinguishes between what the system recommended and what the user actually chose. Presented, started, completed and dismissed states are also kept separate rather than being collapsed into a single event.',
      'This means the product does not treat an offered intervention, a click or an incomplete activity as evidence that the user genuinely used or benefited from it.',
    ],
  },
  {
    title: '4. Learn cautiously from later evidence',
    paragraphs: [
      'Immediate feedback is kept separate from later observation. A previous route can become a Familiar Step only after enough comparable favourable history exists under the current qualification rules.',
      'If evidence is insufficient, stale, unsupported, unsuitable for the current plan revision or otherwise ineligible, the system falls back instead of forcing a personal suggestion.',
    ],
  },
  {
    title: '5. Keep the user in control',
    paragraphs: [
      'The product is intended to support a user’s decision, not replace it. Privacy, opt-out controls and fail-closed personalisation are part of that boundary.',
      'Impulsive does not claim that this mechanism is medical treatment or that it guarantees a behavioural outcome.',
    ],
  },
];

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CurrentInfoPage
      eyebrow="How Impulsive works"
      title="Prepare, pause, choose and learn carefully"
      intro="Impulsive is built around the difficult moment itself and the evidence that follows it, not around a single blocker, game or streak."
      sections={sections}
    />
  </React.StrictMode>,
);
