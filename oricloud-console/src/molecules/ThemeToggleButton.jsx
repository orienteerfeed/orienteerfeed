import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AiOutlineSun, AiFillMoon } from 'react-icons/ai'; // Můžete používat tyto ikony nebo text

export const ThemeToggleButton = () => {
  const [theme, setTheme] = useState('light');

  // Funkce pro změnu tématu
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Nastavení výchozího tématu při načtení komponenty
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        style={{ display: 'inline-block' }}
        key={theme}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <button
          aria-label="Toggle theme"
          onClick={toggleTheme}
          className={`p-2 w-10 h-10 rounded-md focus:outline-none transition-colors duration-200 flex items-center justify-center ${
            theme === 'light'
              ? 'bg-purple-500 text-white'
              : 'bg-orange-400 text-black'
          }`}
        >
          {theme === 'light' ? <AiFillMoon /> : <AiOutlineSun />}
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
