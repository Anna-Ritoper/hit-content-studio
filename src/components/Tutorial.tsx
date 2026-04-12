import { useEffect, useState } from 'react';
import { Joyride, EventData, STATUS, Step } from 'react-joyride';

const STORAGE_KEY = 'hit-studio-tutorial-done';

const steps: Step[] = [
  {
    target: 'body',
    placement: 'center',
    title: 'Welcome to HIT Content Studio',
    content:
      'Quick tour of the Generate screen. Takes 30 seconds. You can skip anytime.',
  },
  {
    target: '[data-tour="voice-selector"]',
    title: 'Pick a voice',
    content:
      'Choose which team member the post is written as. The AI will match their style.',
  },
  {
    target: '[data-tour="mode-toggle"]',
    title: 'Generate or refine',
    content:
      'Either generate a post from scratch, or paste a rough draft and let the AI refine it.',
  },
  {
    target: '[data-tour="content-type"]',
    title: 'Content type and audience',
    content:
      'Tell the model what kind of post this is and who it is for. Both shape the tone.',
  },
  {
    target: '[data-tour="generate-button"]',
    title: 'Generate',
    content: 'Click here to generate the post. Output appears on the right, streaming live.',
  },
];

export default function Tutorial({ run }: { run: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!run) return;
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) setShow(true);
  }, [run]);

  const handleCallback = (data: EventData) => {
    const finished: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finished.includes(data.status as string)) {
      localStorage.setItem(STORAGE_KEY, '1');
      setShow(false);
    }
  };

  if (!show) return null;

  return (
    <Joyride
      steps={steps}
      run={show}
      continuous
      onEvent={handleCallback as any}
      options={{
        primaryColor: '#6B1E2E',
        textColor: '#1A1F3C',
        zIndex: 10000,
      } as any}
    />
  );
}
