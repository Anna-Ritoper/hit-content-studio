import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Joyride, EventData, STATUS, ACTIONS, EVENTS, Step } from 'react-joyride';

type TourStep = Step & { route?: string };

const steps: TourStep[] = [
  {
    route: '/generate',
    target: 'body',
    placement: 'center',
    title: 'Welcome to HIT Content Studio',
    content: 'Quick tour of all five modules and the sidebar. Takes about a minute.',
  },
  // Sidebar
  {
    route: '/generate',
    target: '[data-tour="sidebar-nav"]',
    title: 'Sidebar navigation',
    content: 'Jump between modules here. Hover to expand.',
    placement: 'right',
  },
  // Content Studio
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
    content: 'Choose which team member the post is written as.',
  },
  {
    route: '/generate',
    target: '[data-tour="generate-button"]',
    title: 'Generate',
    content: 'Output streams live on the right.',
  },
  // Visual Studio
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
  // Calendar
  {
    route: '/calendar',
    target: '[data-tour="module-calendar"]',
    title: '3. Calendar',
    content: 'Plan the editorial schedule. Click a day to see entries.',
  },
  {
    route: '/calendar',
    target: '[data-tour="calendar-add"]',
    title: 'Add a post',
    content: 'Create a new calendar entry and link it to a draft.',
  },
  // Voices
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
  // Library
  {
    route: '/library',
    target: '[data-tour="module-library"]',
    title: '5. Draft Library',
    content: 'Every saved draft lives here. Search, edit, and export.',
  },
  // Style Guide
  {
    route: '/style-guide',
    target: '[data-tour="module-styleguide"]',
    title: 'Style Guide',
    content: 'Rules applied to every generated post. Add your own.',
  },
];

interface TutorialProps {
  launchKey?: number;
}

export default function Tutorial({ launchKey = 0 }: TutorialProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  // Launch only when launchKey changes (triggered from Guide button), not on mount
  useEffect(() => {
    if (launchKey > 0) {
      setStepIndex(0);
      if (location.pathname !== '/generate') {
        navigate('/generate');
        setTimeout(() => setRun(true), 450);
      } else {
        setRun(true);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [launchKey]);

  const handleEvent = useCallback((data: EventData) => {
    const { status, type, action } = data;
    const index = (data as any).index ?? 0;

    // X button / close
    if (action === ACTIONS.CLOSE) {
      setRun(false);
      setStepIndex(0);
      return;
    }

    const finished: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finished.includes(status)) {
      setRun(false);
      setStepIndex(0);
      return;
    }

    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      const nextIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      if (nextIndex < 0 || nextIndex >= steps.length) {
        setRun(false);
        setStepIndex(0);
        return;
      }

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

  if (!run) return null;

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
