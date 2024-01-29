import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, FlagIcon } from '../atoms';

export const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const languages = [
    { key: 'cs', country: 'cz', name: 'Česky' },
    { key: 'en', country: 'en', name: 'English' },
  ];
  const [isOpen, setIsOpen] = useState(false);
  console.log(i18n.language);
  const selectedLanguage = languages.find(
    (language) => language.key === i18n.language,
  );

  const handleLanguageChange = async (language) => {
    await i18n.changeLanguage(language.key);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleWindowClick = (event) => {
      const target = event.target.closest('button');
      if (target && target.id === selectedLanguage.key) {
        return;
      }
      setIsOpen(false);
    };
    window.addEventListener('click', handleWindowClick);
    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  }, [selectedLanguage]);

  if (!selectedLanguage) {
    return null;
  }

  return (
    <>
      <div className="flex items-center z-40">
        <div className="relative inline-block text-left">
          <div>
            <Button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className=""
              variant="outline"
              id={selectedLanguage.key}
              aria-haspopup="true"
              aria-expanded={isOpen}
            >
              <FlagIcon
                className="text-xl"
                countryCode={selectedLanguage.country}
              />
              <svg
                className="-mr-1 ml-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L10 12.586l3.293-3.293a1 1 0 011.414 1.414l-4 4z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>
          {isOpen && (
            <div
              className="origin-top-left absolute left-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="language-selector"
            >
              <div className="py-1 grid grid-cols-1" role="none">
                {languages.map((language, index) => {
                  return (
                    <button
                      key={language.key}
                      onClick={() => handleLanguageChange(language)}
                      className={`${
                        selectedLanguage.key === language.key
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-700'
                      } px-4 py-2 text-sm text-left items-center inline-flex hover:bg-gray-100 ${
                        index % 2 === 0 ? 'rounded-r' : 'rounded-l'
                      }`}
                      role="menuitem"
                    >
                      <FlagIcon
                        countryCode={language.country}
                        className="mr-2"
                      />
                      <span className="truncate">{language.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
