import * as Notifications from "expo-notifications";

export async function scheduleHydrationReminders() {
  // Cancel all existing notifications first
  await Notifications.cancelAllScheduledNotificationsAsync();

  const times = [
    { hour: 7, minute: 0 },
    { hour: 9, minute: 0 },
    { hour: 12, minute: 0 },
    { hour: 15, minute: 0 },
    { hour: 18, minute: 0 },
    { hour: 20, minute: 0 },
  ];

  for (const time of times) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⏰ Time to Drink!",
        body: "Your hydration reminder just kicked in. Take a sip 💧",
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        type: "daily",
        hour: time.hour,
        minute: time.minute,
        repeats: true,
      },
    });
  }
}
