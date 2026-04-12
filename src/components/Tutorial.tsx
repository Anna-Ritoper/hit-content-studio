import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Joyride, EventData, STATUS, ACTIONS, EVENTS, Step } from 'react-joyride';

const STORAGE_KEY = 'hit-studio-tutorial-done';

type TourStep = Step & { route?: string };

const steps: TourStep[] = [
  {
    route: '/generate',
    target: 'body',
    placement: 'center',
    title: 'Welcome to HIT Content Studio',
    content: 'Quick tour of all five modules. Takes about a minute. You can skip anytime.',
  },
  // 1. Content Studio (Generate)
  {
    route: '/generate',
    target: '[data-tour="module-content"]',
    title: '1. Content Studio',
    content: 'Generate or refine LinkedIn posts in a chosen voice.',
  },
  {
    route: '/generate',
    target: '[data-tour="voice-selector"]',
    title: 'Pick a voice',
    content: 'Choose which team member the post is written as. The AI matches their style.',
  },
  {
    route: '/generate',
    target: '[data-tour="mode-toggle"]',
    title: 'Generate or refine',
    content: 'Write from scratch or paste a draft and let the AI refine it.',
  },
  {
    route: '/generate',
    target: '[data-tour="generate-button"]',
    title: 'Generate',
    content: 'Output appears on the right, streaming live.',
  },
  // 2. Visual Studio
  {
    route: '/visuals',
    target: '[data-tour="module-visuals"]',
    title: '2. Visual Studio',
    content: 'Create branded carousels and single visuals for each post.',
  },
  {
    route: '/visuals',
    target: '[data-tour="visuals-mode-toggle"]',
    title: 'Quick or custom',
    content: 'Pick a preset layout or build slide by slide.',
  },
  // 3. Calendar
  {
    route: '/calendar',
    target: '[data-tour="module-calendar"]',
    title: '3. Calendar',
    content: 'Plan the editorial schedule. Click a day to see or add entries.',
  },
  {
    route: '/calendar',
    target: '[data-tour="calendar-add"]',
    title: 'Add a post',
    content: 'Create a new calendar entry and link it to a draft.',
  },
  // 4. Voices
  {
    route: '/voices',
    target: '[data-tour="module-voices"]',
    title: '4. Voices',
    content: 'Manage AI tone profiles for each team member.',
  },
  {
    route: '/voices',
    target: '[data-tour="voices-create"]',
    title: 'Create a voice',
    content: 'Paste sample posts and the AI extracts the tone.',
  },
  // 5. Library
  {
    route: '/library',
    target: '[data-tour="module-library"]',
    title: '5. Draft Library',
    content: 'Every saved draft lives here. Search, edit, and export.',
  },
  {
    route: '/library',
    target: '[data-tour="library-search"]',
    title: 'Search drafts',
    content: "Filter by topic, voice, or content. That's the whole tour.",
  },
];

export default function Tutorial() {
  const location = useLocation();
  const navigate = useNavigate();
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    try {
      const done = localStorage.getItem(STORAGE_KEY);
      if (!done && location.pathname === '/generate') {
        setRun(true);
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEvent = useCallback((data: EventData) => {
    const { status, type, action } = data;
    const index = (data as any).index ?? 0;

    const finished: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finished.includes(status)) {
      try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
      setRun(false);
      setStepIndex(0);
      return;
    }

    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      const nextIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      if (nextIndex < 0 || nextIndex >= steps.length) return;

      const nextStep = steps[nextIndex];
      if (nextStep.route && location.pathname !== nextStep.route) {
        setRun(false);
        navigate(nextStep.route);
        setTimeout(() => {
          setStepIndex(nextIndex);
          setRun(true);
        }, 450);
      } else {
        setStepIndex(nextIndex);
      }
    }
  }, [location.pathname, navigate]);

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      continuous
      onEvent={handleEvent}
      options={{
        primaryColor: '#6B1E2E',
        textColor: '#1A1F3C',
        zIndex: 10000,
        showProgress: true,
        skipBeacon: true,
      }}
    />
  );
}
