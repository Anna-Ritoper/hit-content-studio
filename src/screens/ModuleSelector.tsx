import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  PenLine,
  Image as ImageIcon,
  Calendar as CalendarIcon,
  Users
} from 'lucide-react';
import { EDHEC_LOGO_PATH } from '../edhecLogo';

const modules = [
  {
    id: 'content',
    title: 'Content Studio',
    description: 'Posts et newsletters',
    icon: PenLine,
    path: '/generate',
    color: 'bg-[#FDF2F0]', // Light coral/salmon tint
    iconColor: 'text-brand-coral',
  },
  {
    id: 'visual',
    title: 'Visual Studio',
    description: 'Visuels et carrousels',
    icon: ImageIcon,
    path: '/visuals',
    color: 'bg-[#F0F9F7]', // Light teal tint
    iconColor: 'text-brand-teal',
  },
  {
    id: 'calendar',
    title: 'Calendrier',
    description: 'Planifier vos publications',
    icon: CalendarIcon,
    path: '/calendar',
    color: 'bg-[#F0F4F9]', // Light blue tint
    iconColor: 'text-blue-600',
  },
  {
    id: 'voices',
    title: 'Voices',
    description: 'Gérer les profils de ton',
    icon: Users,
    path: '/voices',
    color: 'bg-[#FFF9F0]', // Light amber/gold tint
    iconColor: 'text-amber-600',
  },
];

export default function ModuleSelector() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-warm-white flex flex-col items-center justify-center p-6 sm:p-12">
      <header className="mb-16 text-center">
        <motion.img
          src={EDHEC_LOGO_PATH}
          alt="EDHEC Business School"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="h-14 mx-auto mb-8 object-contain"
        />
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-headline text-brand-bordeaux italic mb-4"
        >
          Que souhaitez-vous faire ?
        </motion.h1>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 80 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="h-1 bg-brand-bordeaux/20 mx-auto rounded-full"
        />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl w-full">
        {modules.map((module, index) => (
          <motion.button
            key={module.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate(module.path)}
            className={`group relative flex flex-col items-start p-8 md:p-10 rounded-3xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left ${module.color} border border-transparent hover:border-brand-bordeaux/10`}
          >
            <div className={`p-4 rounded-2xl bg-white shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300 ${module.iconColor}`}>
              <module.icon className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-headline text-brand-navy mb-2 group-hover:text-brand-bordeaux transition-colors">
              {module.title}
            </h2>
            <p className="text-brand-navy/60 font-body leading-relaxed">
              {module.description}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
