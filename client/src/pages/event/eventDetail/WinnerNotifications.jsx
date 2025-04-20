import { useEffect, useState } from 'react';
import { gql, useSubscription } from '@apollo/client';
import { getNotificationSettings } from '../../../utils/notificationSettings';

const WINNER_UPDATED = gql`
  subscription WinnerUpdated($eventId: String!) {
    winnerUpdated(eventId: $eventId) {
      eventId
      classId
      className
      name
    }
  }
`;

export const WinnerNotification = ({ eventId }) => {
  const { data, error } = useSubscription(WINNER_UPDATED, {
    variables: { eventId },
    skip: !eventId,
  });

  const [isMainTab, setIsMainTab] = useState(false);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'mainTab') {
        setIsMainTab(
          localStorage.getItem('mainTab') === sessionStorage.getItem('myTab'),
        );
      }
    };

    // Each tab got unique ID
    sessionStorage.setItem('myTab', Date.now().toString());

    // První tabulka, která si nastaví "mainTab", je hlavní
    if (!localStorage.getItem('mainTab')) {
      localStorage.setItem('mainTab', sessionStorage.getItem('myTab'));
      setIsMainTab(true);
    }

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (data?.winnerUpdated) {
      // Load latest settings
      const settings = getNotificationSettings();
      // Respect user settings
      if (settings.general.push) sendNotification(data.winnerUpdated);
      if (settings.general.sound && isMainTab)
        playGongAndSpeak(data.winnerUpdated);
    }
  }, [data, isMainTab]);

  if (error) {
    console.error('Subscription error:', error);
    return null;
  }

  return null; // No need to render anything in the UI
};

/**
 * Sends a push notification using the Web Notifications API
 */
const sendNotification = ({ className, name }) => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support system notifications.');
    return;
  }

  if (Notification.permission === 'granted') {
    console.log(name);
    console.log(Notification.permission);
    new Notification('🏆 New Winner!');
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification('🏆 New Winner!', {
          body: `🎉 ${name} just won ${className}!`,
        });
      }
    });
  }
};

const playGongAndSpeak = (winner) => {
  if ('speechSynthesis' in window) {
    // Play gong sound
    const gongSound = new Audio('/sounds/chime.mp3');
    gongSound
      .play()
      .then(() => {
        console.log('🔔 Gong přehrán');

        // Po krátké prodlevě spusť hlasové oznámení
        setTimeout(() => {
          const message = new SpeechSynthesisUtterance(
            `Změna pořadí v kategorii ${winner.className}, do vedení se dostal ${winner.name}`,
          );
          message.lang = 'cs-CZ'; // Nastavení češtiny
          message.rate = 1; // Rychlost mluvení
          message.pitch = 1; // Výška hlasu
          speechSynthesis.speak(message);
          console.log('🔊 Hlášení vítěze přehráno');
        }, 1000); // Prodleva 1 sekunda po gongu
      })
      .catch((error) => console.error('⚠️ Chyba při přehrávání gongu:', error));
  } else {
    console.warn('⚠️ Speech synthesis není podporována v tomto prohlížeči.');
  }
};
