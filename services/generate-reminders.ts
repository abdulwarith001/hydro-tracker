export const getTimeAwake = (sleep: string, wake: string) => {
  const [sleepH, sleepM] = sleep.split(":").map(Number);
  const [wakeH, wakeM] = wake.split(":").map(Number);

  let sleepTime = sleepH + sleepM / 60;
  let wakeTime = wakeH + wakeM / 60;

  if (wakeTime < sleepTime) wakeTime += 24; // next day

  const sleepDuration = wakeTime - sleepTime;
  const awakeDuration = 24 - sleepDuration;

  return Number(awakeDuration.toFixed(2)); // hours awake
};

interface ReminderSchedule {
  interval: number; // in minutes
  reminders: string[]; // array of reminder times
  totalReminders: number;
}
export const calculateReminderSchedule = (
  awakeDuration: number,
  totalCups: number,
  wakeTime: string
): ReminderSchedule => {
  
  const totalMinutesAwake = awakeDuration * 60;
  const [wakeHour, wakeMinute] = wakeTime.split(":").map(Number);

  const reminders: string[] = [];
  const startMinutes = wakeHour * 60 + wakeMinute;

  // Distribute totalCups reminders evenly across the awake period
  const interval = totalMinutesAwake / totalCups;

  for (let i = 0; i < totalCups; i++) {
    const currentMinutes = startMinutes + Math.round(i * interval);
    const hours = Math.floor(currentMinutes / 60) % 24;
    const minutes = currentMinutes % 60;
    const timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    reminders.push(timeString);
  }

  return {
    interval: Math.round(interval),
    reminders,
    totalReminders: reminders.length,
  };
};

// Helper function to format reminder schedule for display
export const formatReminderInfo = (schedule: ReminderSchedule): string => {
  if (schedule.interval === 60) {
    return `You'll be reminded every hour (${schedule.totalReminders} reminders)`;
  } else if (schedule.interval === 30) {
    return `You'll be reminded every 30 minutes (${schedule.totalReminders} reminders)`;
  } else if (schedule.interval === 15) {
    return `You'll be reminded every 15 minutes (${schedule.totalReminders} reminders)`;
  } else {
    return `You'll be reminded every ${schedule.interval} minutes (${schedule.totalReminders} reminders)`;
  }
};
