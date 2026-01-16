const beep = new Audio('beep.mp3');

export function playBeep() {
  beep.play().catch((err) => {
    console.warn("Audio play failed", err);
  });
}
