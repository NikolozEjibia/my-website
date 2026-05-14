import { createContext, useContext, useState } from 'react';
import { translations } from '../data/i18n';

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState('en');
  const t = (key) => translations[lang][key] ?? translations['en'][key] ?? key;
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
