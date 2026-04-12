import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const FULL_TITLE = 'HIT Content Studio';
const CHAR_MS = 60;

export default function Splash() {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    if (charCount >= FULL_TITLE.length) {
      setTypingDone(true);
      return;
    }
    const t = setTimeout(() => setCharCount((c) => c + 1), CHAR_MS);
    return () => clearTimeout(t);
  }, [charCount]);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => navigate('/hub'), 600);
  };

  const displayText = FULL_TITLE.slice(0, charCount);

  return (
    <div
      className="fixed inset-0 overflow-hidden cursor-pointer group select-none bg-brand-bordeaux"
      onClick={handleEnter}
    >
      <AnimatePresence mode="wait">
        {!isExiting ? (
          <motion.div
            key="splash-content"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full flex flex-col items-center justify-center p-6 relative z-10"
          >
            <div className="flex flex-col items-center">
              {/* Fixed-height title container so layout does not reflow */}
              <div
                className="flex items-center mb-4"
                style={{ minHeight: '6rem' }}
              >
                <h1 className="text-6xl md:text-8xl font-headline font-bold text-white whitespace-pre">
                  {displayText}
                  <span
                    className={`inline-block w-[3px] h-12 md:h-20 bg-white ml-1 align-middle ${
                      typingDone ? 'animate-blink' : ''
                    }`}
                    style={{ opacity: typingDone ? undefined : 1 }}
                  />
                </h1>
              </div>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: typingDone ? 1 : 0 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="h-px w-32 md:w-48 bg-white/40 mb-6 origin-center"
              />

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: typingDone ? 0.9 : 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-xl md:text-2xl text-white font-body font-light tracking-[0.05em] text-center"
              >
                Chaire Management in Innovative Health
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: typingDone ? 0.6 : 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-2 text-xs md:text-sm text-white font-body font-light tracking-[0.2em] uppercase"
              >
                EDHEC Business School
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: typingDone ? 0.6 : 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute bottom-12 text-white font-body uppercase tracking-[0.2em] text-sm group-hover:opacity-100"
            >
              Cliquez pour entrer : Click to enter
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="exit-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-brand-warm-white z-[100]"
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
