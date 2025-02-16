import React, { useEffect, useState } from 'react';
import {
  AiOutlineSound,
  AiFillSound,
  AiOutlineBell,
  AiFillBell,
} from 'react-icons/ai';
import {
  getNotificationSettings,
  saveNotificationSettings,
} from '../../../utils/notificationSettings';

export const NotificationControlPanel = () => {
  const [settings, setSettings] = useState(getNotificationSettings());

  useEffect(() => {
    saveNotificationSettings(settings);
  }, [settings]);

  const toggleSound = () => {
    setSettings((prev) => ({
      ...prev,
      general: { ...prev.general, sound: !prev.general.sound },
    }));
  };

  const toggleNotifications = () => {
    setSettings((prev) => ({
      ...prev,
      general: { ...prev.general, push: !prev.general.push },
    }));
  };

  return (
    <div className="inline-flex items-center rounded-full border border-gray-200 dark:border-zinc-800 p-1 shadow-sm bg-white dark:bg-zinc-700">
      {/* Sound Toggle */}
      <button
        onClick={toggleSound}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-accent transition-all"
      >
        {settings.general.sound ? (
          <AiFillSound
            size={20}
            className="dark:text-white dark:hover:text-black"
          />
        ) : (
          <AiOutlineSound
            size={20}
            className="dark:text-white dark:hover:text-black"
          />
        )}
      </button>

      {/* Notification Toggle */}
      <button
        onClick={toggleNotifications}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-accent transition-all"
      >
        {settings.general.push ? (
          <AiFillBell
            size={20}
            className="dark:text-white dark:hover:text-black"
          />
        ) : (
          <AiOutlineBell
            size={20}
            className="dark:text-white dark:hover:text-black"
          />
        )}
      </button>
    </div>
  );
};
