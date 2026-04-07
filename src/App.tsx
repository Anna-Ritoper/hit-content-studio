import React from 'react';
/**
 * GLOBAL RULE: NO EM DASHES (U+2014) OR EN DASHES (U+2013) ANYWHERE IN THE APP.
 * Use colons (:), pipes (|), commas, or line breaks instead.
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Splash from './screens/Splash';
import ModuleSelector from './screens/ModuleSelector';
import Generate from './screens/Generate';
import Visuals from './screens/Visuals';
import Voices from './screens/Voices';
import StyleGuide from './screens/StyleGuide';
import Calendar from './screens/Calendar';
import Library from './screens/Library';
import Settings from './screens/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Level 1: Splash Screen */}
        <Route path="/" element={<Splash />} />

        {/* Level 2: Module Selector */}
        <Route path="/hub" element={<ModuleSelector />} />

        {/* Level 3: The App (with Sidebar) */}
        <Route element={<Layout />}>
          <Route path="/generate" element={<Generate />} />
          <Route path="/visuals" element={<Visuals />} />
          <Route path="/voices" element={<Voices />} />
          <Route path="/style-guide" element={<StyleGuide />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/library" element={<Library />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
