import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Function to calculate time left
const calculateTimeLeft = (expiryDate) => {
  const now = new Date();
  const difference = new Date(expiryDate) - now;

  let time = { days: 0, hours: 0, minutes: 0, seconds: 0 };

  if (difference > 0) {
    time = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return time;
};

export const CountdownTimer = ({ expiryDate }) => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Update time left every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(calculateTimeLeft(expiryDate));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [expiryDate]);

  return (
    <div className="flex items-center w-full gap-2">
      <TimerElement
        label={t('Timer.Days', { ns: 'common' })}
        value={timeLeft.days}
      />
      <TimerElement
        label={t('Timer.Hours', { ns: 'common' })}
        value={timeLeft.hours}
      />
      <TimerElement
        label={t('Timer.Minutes', { ns: 'common' })}
        value={timeLeft.minutes}
      />
      <TimerElement
        label={t('Timer.Seconds', { ns: 'common' })}
        value={timeLeft.seconds}
      />
    </div>
  );
};

const TimerElement = ({ label, value }) => {
  return (
    <div>
      <div className="pr-1.5 pl-2 relative bg-primary rounded-md w-max before:contents-[''] before:absolute before:h-full before:w-0.5 before:top-0 before:left-1/2 before:-translate-x-1/2 before:bg-white before:z-10">
        <h3 className="text-lg text-white tracking-[20px] max-w-[44px] text-center">
          {value.toString().padStart(2, '0')}
        </h3>
      </div>
      <p className="text-sm font-normal text-gray-900 dark:text-white mt-1 text-center w-full">
        {label}
      </p>
    </div>
  );
};
