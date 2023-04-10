type AddTime = (time1: string, time2: string) => string;

/**
 * addTime function adds two times and returns the result in the format hh:mm,
 * following the 24h format.
 *
 * @param {string} time1
 * @param {string} time2
 *
 * @example
 * addTime("04:00", "05:00") // 09:00
 * addTime("22:00", "04:00") // 02:00
 * addTime("12:00", "13:00") // 01:00
 *
 * @returns {string} time1 + time2
 */

export const addTime: AddTime = (time1, time2) => {
  if (time1 && time2) {
    const time1Arr = time1?.split(":");
    const time2Arr = time2.split(":");
    const time1Hours = parseInt(time1Arr[0]);
    const time1Minutes = parseInt(time1Arr[1]);
    const time2Hours = parseInt(time2Arr[0]);
    const time2Minutes = parseInt(time2Arr[1]);
    const hours = (time1Hours + time2Hours) % 24;
    const minutes = time1Minutes + time2Minutes;
    if (minutes >= 60) {
      const newHours = (hours + Math.floor(minutes / 60)) % 24;
      const newMinutes = minutes % 60;

      if (newMinutes < 10) {
        return `${newHours}:0${newMinutes}`;
      }
      return `${newHours}:${newMinutes}`;
    } else {
      if (minutes < 10) {
        return `${hours}:0${minutes}`;
      }
      return `${hours}:${minutes}`;
    }
  }
};
