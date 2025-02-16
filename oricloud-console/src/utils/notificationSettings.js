const NOTIFICATION_STORAGE_KEY = 'notifications';

/**
 * Retrieves notification settings from local storage.
 */
export const getNotificationSettings = () => {
  const storedSettings = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
  return storedSettings
    ? JSON.parse(storedSettings)
    : {
        general: { sound: true, push: true },
        custom: { classes: {}, competitors: {} },
      };
};

/**
 * Saves notification settings to local storage.
 */
export const saveNotificationSettings = (settings) => {
  localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(settings));
};

/**
 * Toggles a setting (sound or push notifications).
 */
export const toggleNotificationSetting = (type) => {
  const settings = getNotificationSettings();
  settings.general[type] = !settings.general[type];
  saveNotificationSettings(settings);
  return settings;
};

export { NOTIFICATION_STORAGE_KEY };
