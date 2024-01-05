const getHoursAndMinute = (date: Date) => {
  const convertedDate = new Date(date);
  const hours = convertedDate.getHours();
  const minutes = convertedDate.getMinutes();
  let minutesSting;
  if (minutes < 10) {
    minutesSting = "0" + String(minutes);
  } else {
    minutesSting = String(minutes);
  }
  return String(hours) + ":" + minutesSting;
};

export default getHoursAndMinute;
