export default function getDateFromProp(dateProp: DatePropertyValue[1][0]) {
  try {
    if (!dateProp[1].start_date) return new Date("Invalid Date");
    const providedDate = new Date(
      dateProp[1].start_date + " " + (dateProp[1].start_time || "")
    ).getTime();

    // calculate offset from provided time zone
    const timezoneOffset =
      new Date(
        new Date().toLocaleString("en-US", {
          timeZone: dateProp[1].time_zone,
        })
      ).getTime() - new Date().getTime();

    // initialize subtracting time zone offset
    return new Date(providedDate - timezoneOffset);
  } catch {
    return new Date("Invalid Date");
  }
}
