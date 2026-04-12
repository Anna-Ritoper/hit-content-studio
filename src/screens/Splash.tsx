import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';

export default function Splash() {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const fullText = "HIT Content Studio";

  // Mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for each blob (different "weights")
  const springConfig1 = { stiffness: 50, damping: 20 }; // Fast
  const springConfig2 = { stiffness: 30, damping: 25 }; // Medium
  const springConfig3 = { stiffness: 15, damping: 30 }; // Slow

  const blob1X = useSpring(mouseX, springConfig1);
  const blob1Y = useSpring(mouseY, springConfig1);
  
  const blob2X = useSpring(mouseX, springConfig2);
  const blob2Y = useSpring(mouseY, springConfig2);
  
  const blob3X = useSpring(mouseX, springConfig3);
  const blob3Y = useSpring(mouseY, springConfig3);

  // Distortion effects based on movement
  const blob1Scale = useTransform(blob1X, [0, 1000], [1, 1.2]);
  const blob2Rotate = useTransform(blob2X, [0, 1000], [0, 15]);
  const blob3Skew = useTransform(blob3Y, [0, 1000], [0, 10]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    let currentText = '';
    let index = 0;

    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        currentText += fullText[index];
        setDisplayText(currentText);
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTypingComplete(true);
        
        // Cursor blinks 3 times then disappears
        let blinkCount = 0;
        const blinkInterval = setInterval(() => {
          setShowCursor(prev => !prev);
          blinkCount++;
          if (blinkCount >= 6) { // 3 full blinks (on/off)
            clearInterval(blinkInterval);
            setShowCursor(false);
          }
        }, 400);
      }
    }, 90); // ~80-100ms per character

    return () => clearInterval(typingInterval);
  }, []);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate('/hub');
    }, 800);
  };

  return (
    <div 
      className="fixed inset-0 overflow-hidden cursor-pointer group select-none bg-brand-bordeaux" 
      onClick={handleEnter}
    >
      {/* Mouse-Reactive Blobs (EFFECT: Follow + Distortion) */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-60 pointer-events-none">
        {/* Blob 1: Coral (Fastest) */}
        <motion.div 
          className="blob w-[600px] h-[600px] -ml-[300px] -mt-[300px]"
          style={{ 
            x: blob1X,
            y: blob1Y,
            scale: blob1Scale,
            background: 'radial-gradient(circle, #D4614A 0%, transparent 70%)',
          }}
        />
        {/* Blob 2: Rose (Medium) */}
        <motion.div 
          className="blob w-[800px] h-[700px] -ml-[400px] -mt-[350px]"
          style={{ 
            x: blob2X,
            y: blob2Y,
            rotate: blob2Rotate,
            background: 'radial-gradient(circle, #9B3545 0%, transparent 70%)',
          }}
        />
        {/* Blob 3: Deep Burgundy (Slowest) */}
        <motion.div 
          className="blob w-[900px] h-[900px] -ml-[450px] -mt-[450px]"
          style={{ 
            x: blob3X,
            y: blob3Y,
            skewX: blob3Skew,
            background: 'radial-gradient(circle, #4B0E1A 0%, transparent 70%)',
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        {!isExiting ? (
          <motion.div 
            key="splash-content"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="h-full w-full flex flex-col items-center justify-center p-6 relative z-10"
          >
            <div className="relative flex flex-col items-center">
              {/* Main Title (EFFECT 1: Typing) */}
              <div className="flex items-center mb-4">
                <h1 className="text-6xl md:text-8xl font-headline font-bold text-white animate-title-glow">
                  {displayText}
                  {showCursor && (
                    <span className="inline-block w-1 h-12 md:h-20 bg-white ml-2 animate-blink">|</span>
                  )}
                </h1>
              </div>

              {/* Animated Line */}
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isTypingComplete ? 1 : 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="h-px w-32 md:w-48 bg-brand-warm-white/40 mb-6 origin-center"
              />

              {/* Subtitle (Static) */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: isTypingComplete ? 0.85 : 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-xl md:text-2xl text-white font-poppins font-light tracking-[0.05em] text-center mb-2"
              >
                Chaire Management in Innovative Health
              </motion.p>

              {/* Tagline (Bilingual Fade) */}
              <div className="relative h-6 w-full flex items-center justify-center">
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isTypingComplete ? 1 : 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className={`absolute text-sm md:text-base text-white/60 font-poppins font-light tracking-[0.1em] uppercase text-center ${isTypingComplete ? 'animate-subtitle-1' : 'opacity-0'}`}
                >
                  EDHEC Business School
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isTypingComplete ? 1 : 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className={`absolute text-sm md:text-base text-white/60 font-poppins font-light tracking-[0.1em] uppercase text-center ${isTypingComplete ? 'animate-subtitle-2' : 'opacity-0'}`}
                >
                  L'innovation en santé
                </motion.p>
              </div>
            </div>

            {/* Enter Prompt */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isTypingComplete ? 0.6 : 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="absolute bottom-12 text-white font-body uppercase tracking-[0.2em] text-sm transition-opacity duration-500 group-hover:opacity-100"
            >
              Cliquez pour entrer
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            key="exit-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-brand-warm-white z-[100]"
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
