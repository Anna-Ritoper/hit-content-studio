import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function Splash() {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => navigate('/hub'), 600);
  };

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
            <div className="flex flex-col items-center gap-6">
              <motion.img
                src="/EDHEC_Logo_horizontal_white.png"
                alt="EDHEC"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-16 md:h-20 w-auto object-contain mb-2"
              />

              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                className="text-5xl md:text-7xl font-headline font-bold text-white text-center"
              >
                HIT Content Studio
              </motion.h1>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 1.1, ease: 'easeOut' }}
                className="h-px w-32 md:w-48 bg-white/40 origin-center"
              />

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="text-lg md:text-2xl text-white font-body font-light tracking-[0.05em] text-center"
              >
                Chaire Management in Innovative Health
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 0.6, delay: 1.8 }}
                className="text-xs md:text-sm text-white font-body font-light tracking-[0.2em] uppercase"
              >
                EDHEC Business School
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 0.6, delay: 2.2 }}
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
