import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, signIn } from '../firebase';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, X } from 'lucide-react';
import { isDemoMode, setDemoMode } from '../demoData';

const GUIDE_HIDDEN_KEY = 'hit-guide-hidden';

function GuideModal({ onClose }: { onClose: () => void }) {
  const [hideForever, setHideForever] = useState(false);

  const handleClose = () => {
    if (hideForever) {
      try { localStorage.setItem(GUIDE_HIDDEN_KEY, 'true'); } catch {}
    }
    onClose();
  };

  const steps = [
    { num: '1', title: 'Choisir une voix', desc: 'Selectionnez le profil de la personne qui publiera (Simone, Loick, Deborah...)' },
    { num: '2', title: 'Remplir le formulaire', desc: 'Sujet, donnees cles, type de contenu, cible, langue' },
    { num: '3', title: 'Generer', desc: 'Cliquez sur "Generate Post" et l\'IA cree le post dans le ton choisi' },
    { num: '4', title: 'Affiner', desc: 'Utilisez "Refine a draft" pour ameliorer un brouillon existant' },
    { num: '5', title: 'Sauvegarder', desc: 'Enregistrez dans la bibliotheque ou ajoutez au calendrier editorial' },
    { num: '6', title: 'Visuels', desc: 'Creez des infographies et carrousels dans Visual Studio' },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 bg-brand-navy/30 backdrop-blur-sm z-[200]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-brand-warm-white rounded-2xl shadow-2xl z-[210] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-brand-bordeaux px-8 py-6 flex items-center justify-between">
          <h2 className="font-headline text-2xl text-white italic">HIT Content Studio</h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-8 py-2 bg-brand-bordeaux/90">
          <p className="text-white/80 text-xs font-bold uppercase tracking-widest">Guide rapide</p>
        </div>

        {/* Steps */}
        <div className="px-8 py-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {steps.map(step => (
            <div key={step.num} className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-brand-bordeaux/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-brand-bordeaux">{step.num}</span>
              </div>
              <div>
                <p className="font-bold text-brand-navy text-sm">{step.title}</p>
                <p className="text-brand-navy/60 text-sm mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-brand-bordeaux/10 flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hideForever}
              onChange={(e) => setHideForever(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-brand-navy/20 text-brand-bordeaux accent-brand-bordeaux"
            />
            <span className="text-xs text-brand-navy/50">Ne plus afficher</span>
          </label>
          <button
            onClick={handleClose}
            className="px-5 py-2 bg-brand-bordeaux text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-brand-bordeaux/90 transition-all"
          >
            Compris
          </button>
        </div>
      </motion.div>
    </>
  );
}

export default function Layout() {
  const [user, loading] = useAuthState(auth);
  const [demo, setDemo] = useState(isDemoMode());
  const [showGuide, setShowGuide] = useState(false);

  const toggleDemo = () => {
    const next = !demo;
    setDemoMode(next);
    setDemo(next);
    window.dispatchEvent(new Event('demo-mode-change'));
  };

  const openGuide = () => {
    try {
      if (localStorage.getItem(GUIDE_HIDDEN_KEY) === 'true') {
        // User checked "Ne plus afficher" before, but they clicked the button explicitly, so show it
      }
    } catch {}
    setShowGuide(true);
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-brand-warm-white">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-12 h-12 bg-brand-bordeaux rounded-lg flex items-center justify-center text-white font-headline font-bold text-2xl"
        >
          H
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-brand-warm-white p-6">
        <div className="w-16 h-16 bg-brand-bordeaux rounded-xl flex items-center justify-center text-white font-headline font-bold text-4xl mb-8 shadow-xl">
          H
        </div>
        <h1 className="font-headline text-4xl text-brand-bordeaux mb-4 text-center">HIT Content Studio</h1>
        <p className="font-body text-brand-navy/60 mb-8 text-center max-w-md">
          Transform complex clinical research into engaging thought leadership for the EDHEC community.
        </p>
        <button
          onClick={() => signIn()}
          className="btn-primary flex items-center gap-3"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-warm-white flex">
      <Sidebar />
      <main className="flex-1 ml-[64px] p-8">
        {/* Top-right controls: Guide + Demo Mode */}
        <div className="flex justify-end items-center gap-2 mb-2">
          <button
            onClick={openGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border border-brand-bordeaux/15 text-brand-bordeaux/50 hover:border-brand-bordeaux hover:text-brand-bordeaux"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Guide
          </button>
          <button
            onClick={toggleDemo}
            className={
              demo
                ? "flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all bg-brand-teal text-white"
                : "flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border border-brand-navy/15 text-brand-navy/40 hover:border-brand-teal hover:text-brand-teal"
            }
          >
            <div className={
              demo
                ? "w-2 h-2 rounded-full bg-white animate-pulse"
                : "w-2 h-2 rounded-full bg-brand-navy/20"
            } />
            Demo Mode
          </button>
        </div>

        {/* Demo banner */}
        {demo && (
          <div className="mb-4 px-4 py-2 bg-brand-teal/10 border border-brand-teal/20 rounded-lg text-brand-teal text-xs font-bold text-center">
            Mode Demo actif
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Guide Modal */}
      <AnimatePresence>
        {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}
      </AnimatePresence>
    </div>
  );
}
