export const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

  return {
    value: `${hour.toString().padStart(2, '0')}:${minute} ${period}`,
    label: `${displayHour}:${minute} ${period}`
  };
});

export const year = new Date().getFullYear();
