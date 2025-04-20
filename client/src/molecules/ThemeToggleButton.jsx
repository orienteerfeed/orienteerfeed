import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AiOutlineSun, AiOutlineMoon } from 'react-icons/ai'; // Můžete používat tyto ikony nebo text

export const ThemeToggleButton = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'),
  );

  // Apply theme on load
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  // Funkce pro změnu tématu
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        className="cursor-pointer text-gray-600 dark:text-white"
        onClick={() => toggleTheme()}
        style={{ display: 'inline-block' }}
        key={theme}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {theme === 'light' ? <AiOutlineMoon /> : <AiOutlineSun />}
      </motion.div>
    </AnimatePresence>
  );
};
