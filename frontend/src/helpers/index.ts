const beep = new Audio('beep.mp3');

export function playBeep() {
  beep.play().catch((err) => {
    console.warn("Audio play failed", err);
  });
}

export const formatTimeToAMPM = (timeStr: string) => {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

export const timeToMinutes = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};