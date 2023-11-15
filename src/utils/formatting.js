export function formatDatetime(datetime) {
  return new Date(datetime).toLocaleString("no-NB", {
    timeZone: "CET",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
