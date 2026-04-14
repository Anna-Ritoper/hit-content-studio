import React from 'react';
/**
 * GLOBAL RULE: NO EM DASHES (U+2014) OR EN DASHES (U+2013) ANYWHERE IN THE APP.
 * Use colons (:), pipes (|), commas, or line breaks instead.
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import PasswordGate from './components/PasswordGate';
import { I18nProvider } from './i18n';
import { seedVoiceProfiles, seedContextLibrary } from './seedData';

seedVoiceProfiles();
seedContextLibrary();

export default function App() {
  return (
    <PasswordGate>
      <I18nProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/hub" element={<ModuleSelector />} />
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
      </I18nProvider>
    </PasswordGate>
  );
}
