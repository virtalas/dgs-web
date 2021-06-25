export const dateFrom = (dateString: string) => {
  // Safari's JS cannot parse dates with "-", so change them to "/":
  return new Date(dateString.replace(/-/g, "/"))
}

export const areOnSameDay = (d1: Date | undefined, d2: Date | undefined): Boolean => {
  if (!d1 || !d2) return false
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
}

export const toISOStringWithTimezone = (date: Date): string => {
  var tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? '+' : '-',
    pad = function(num: number) {
      var norm = Math.floor(Math.abs(num))
      return (norm < 10 ? '0' : '') + norm
    }

  return date.getFullYear() +
    '-' + pad(date.getMonth() + 1) +
    '-' + pad(date.getDate()) +
    'T' + pad(date.getHours()) +
    ':' + pad(date.getMinutes()) +
    ':' + pad(date.getSeconds()) +
    dif + pad(tzo / 60) +
    ':' + pad(tzo % 60);
}
