import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  PenLine,
  Users,
  Calendar as CalendarIcon,
  Library,
  Settings as SettingsIcon,
  Image as ImageIcon,
  BookOpen
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { EDHEC_LOGO_PATH } from '../edhecLogo';
import { useI18n } from '../i18n';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useI18n();

  const navItems = [
    { icon: PenLine, label: t('nav.generate'), path: '/generate', tour: 'nav-generate' },
    { icon: ImageIcon, label: t('nav.visuals'), path: '/visuals', tour: 'nav-visuals' },
    { icon: Users, label: t('nav.voices'), path: '/voices', tour: 'nav-voices' },
    { icon: CalendarIcon, label: t('nav.calendar'), path: '/calendar', tour: 'nav-calendar' },
    { icon: BookOpen, label: t('nav.styleGuide'), path: '/style-guide', tour: 'nav-styleguide' },
    { icon: Library, label: t('nav.library'), path: '/library', tour: 'nav-library' },
    { icon: SettingsIcon, label: t('nav.settings'), path: '/settings', tour: 'nav-settings' },
  ];

  return (
    <motion.aside
      data-tour="sidebar-nav"
      className={cn(
        'fixed left-0 top-[56px] h-[calc(100vh-56px)] bg-white border-r border-brand-bordeaux/10 z-30 flex flex-col transition-all duration-300 ease-in-out',
        isExpanded ? 'w-[220px]' : 'w-[64px]'
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <Link
        to="/hub"
        className="p-4 flex items-center h-16 border-b border-brand-bordeaux/5 overflow-hidden hover:bg-brand-bordeaux/5 transition-colors"
      >
        <img src={EDHEC_LOGO_PATH} alt="EDHEC" className="flex-shrink-0 w-8 h-8 object-contain" />
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="ml-3 flex flex-col"
            >
              <span className="font-headline font-bold text-brand-bordeaux text-sm leading-tight">HIT Content</span>
              <span className="text-[8px] font-body font-bold text-brand-navy/60 uppercase tracking-tighter leading-none">Studio</span>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>

      <nav className="flex-1 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            data-tour={item.tour}
            title={item.label}
            className={({ isActive }) => cn(
              'flex items-center h-12 px-5 transition-colors relative group',
              isActive ? 'text-brand-bordeaux bg-brand-bordeaux/5' : 'text-brand-navy/60 hover:text-brand-bordeaux hover:bg-brand-bordeaux/5'
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="ml-4 font-body font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-bordeaux"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  );
}
