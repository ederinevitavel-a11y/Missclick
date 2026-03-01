import { intervalToDuration, format } from 'date-fns';

export const formatTimeRemaining = (endTime: number): string => {
  const now = Date.now();
  if (now >= endTime) return "00:00";

  const duration = intervalToDuration({ start: now, end: endTime });
  
  const hours = duration.hours || 0;
  const minutes = duration.minutes || 0;
  // We strictly want HH:mm format usually, but simple mm is okay for short
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

export const formatEndTime = (timestamp: number): string => {
  return format(new Date(timestamp), 'HH:mm');
};

export const calculateEndTime = (startTime: number, durationMinutes: number): number => {
  return startTime + (durationMinutes * 60 * 1000);
};