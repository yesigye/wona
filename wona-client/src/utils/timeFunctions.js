/*jslint: es6 */
import dayjs from "dayjs";

export function militaryTimeToStandard(militaryTime) {
  // Check correct time format and split into components
  let time = militaryTime
    .toString()
    .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [militaryTime];

  // If the time format is correct
  if (time.length > 1) {
    // Remove full string match value
    time = time.slice(1);
    time[5] = +time[0] < 12 ? "AM" : "PM";
    time[0] = +time[0] % 12 || 12;
  }

  return time.join("");
}

export function formatTimeSlots(slots = [], range = [], booked = []) {
  let formattedSlots = [];
  // Do removal only for UI visible booking days
  range.map((date) => {
    const dayIndex = parseInt(date.format("d"));
    // Divide time slots into period segments
    const period = { morning: [], afternoon: [], evening: [], night: [] };
    let tempSlots = slots[dayIndex] ? [...slots[dayIndex]] : [];
    let total = 0;

    // Remove already booked slots from doctor slots
    booked.map((bookedDate) => {
      // Traverse slot times for each day
      tempSlots.map((time, index) => {
        // Add time to slot date and conpare with booked date
        if (
          dayjs(date.format("YYYY-MM-DD") + " " + time).diff(
            dayjs(bookedDate)
          ) === 0
        ) {
          // remove booked time from slots array
          tempSlots.splice(index, 1);
        }
      });
    });

    // Put each time slot into its time period
    tempSlots.map((time) => {
      const timeInt = parseInt(time);

      if (timeInt >= 6 && timeInt < 12) {
        // Morning slots (6:00 am - 12:00 pm)
        period.morning.push(time);
      }
      if (timeInt >= 12 && timeInt < 17) {
        // Afernon slots (12:00 pm - 5:00 pm)
        period.afternoon.push(time);
      }
      if (timeInt >= 17 && timeInt < 20) {
        // Evening slots (5:00 pm - 8:00 pm)
        period.evening.push(time);
      }
      if (timeInt >= 20 && timeInt < 6) {
        // Evening slots (8:00 pm - 6:00 am)
        period.evening.push(time);
      }
    });

    // Add up slots in all time periods
    for (let i in period) total += period[i].length;

    formattedSlots.push({ date, period, total });
  });

  return formattedSlots;
}

export function nextOpenSlot(slots, date) {
  let dayIndex = parseInt(dayjs(date).format("d"));
  let index = dayIndex < 7 ? dayIndex : 0;
  let pointer = index + 1;
  let counter = 0;

  while (index !== pointer && counter <= 7) {
    if (slots.hasOwnProperty(pointer) && slots["" + pointer].length > 0) {
      // We found an open slot
      return {
        index: counter + 1,
        date: dayjs(date).add(counter + 1, "day"),
      };
    } else if (pointer < 7) {
      // Move on to next day
      pointer += 1;
    } else {
      // End of the week, go back to begining
      pointer = 1;
    }
    counter += 1;
  }

  return null;
}
