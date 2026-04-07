import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PenLine, 
  Users, 
  Calendar as CalendarIcon, 
  Library, 
  Settings as SettingsIcon,
  ChevronRight,
  LogOut,
  Image as ImageIcon,
  BookOpen
} from 'lucide-react';
import { auth, logOut } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: PenLine, label: 'Generate', path: '/generate' },
  { icon: ImageIcon, label: 'Visuals', path: '/visuals' },
  { icon: Users, label: 'Voices', path: '/voices' },
  { icon: CalendarIcon, label: 'Calendar', path: '/calendar' },
  { icon: BookOpen, label: 'Style Guide', path: '/style-guide' },
  { icon: Library, label: 'Library', path: '/library' },
  { icon: SettingsIcon, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [user] = useAuthState(auth);

  return (
    <motion.aside
      className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-brand-bordeaux/10 z-50 flex flex-col transition-all duration-300 ease-in-out",
        isExpanded ? "w-[220px]" : "w-[64px]"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <Link 
        to="/hub" 
        className="p-4 flex items-center h-16 border-b border-brand-bordeaux/5 overflow-hidden hover:bg-brand-bordeaux/5 transition-colors"
      >
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
          <svg viewBox="0 0 40 40" className="w-8 h-8 text-brand-bordeaux fill-current">
            <path d="M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20 20-8.954 20-20S31.046 0 20 0zm0 36c-8.837 0-16-7.163-16-16S11.163 4 20 4s16 7.163 16 16-7.163 16-16 16z"/>
            <path d="M20 8c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12S26.627 8 20 8zm0 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"/>
          </svg>
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="ml-3 flex flex-col"
            >
              <span className="font-headline font-bold text-brand-bordeaux text-sm leading-tight">
                EDHEC
              </span>
              <span className="text-[8px] font-body font-bold text-brand-navy/60 uppercase tracking-tighter leading-none">
                Content Studio
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>

      <nav className="flex-1 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center h-12 px-5 transition-colors relative group",
              isActive ? "text-brand-bordeaux bg-brand-bordeaux/5" : "text-brand-navy/60 hover:text-brand-bordeaux hover:bg-brand-bordeaux/5"
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

      <div className="p-4 border-t border-brand-bordeaux/5">
        <div className="flex items-center">
          <img
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'User'}&background=6B1E2E&color=fff`}
            alt="User"
            className="w-8 h-8 rounded-full border border-brand-bordeaux/10"
          />
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="ml-3 overflow-hidden"
              >
                <p className="text-xs font-bold text-brand-navy truncate">{user?.displayName}</p>
                <button
                  onClick={() => logOut()}
                  className="text-[10px] text-brand-coral hover:underline flex items-center"
                >
                  <LogOut className="w-2 h-2 mr-1" />
                  Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
