export function representDate(stDate: string | null = null): string {
    const date = stDate ? new Date(stDate) : new Date()
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(2)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    
    return `${day}-${month}-${year} ${hours}:${minutes}`
}

export function toISOString(stDate: string): string {
    const [datePart, timePart] = stDate.split(' ')
    const [day, month, year] = datePart.split('-')
    const [hours, minutes] = timePart.split(':')
    const offset = getTimezoneOffset()
    const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hours) - offset.hours, Number(minutes) - offset.minutes);
    console.log(date);
    console.log(date.toISOString());
    
    return date.toISOString();
}

function getTimezoneOffset(): { hours: number, minutes: number } {
    const currentDate = new Date();
    const offsetMinutes = currentDate.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
    const offsetMinutesRemainder = Math.abs(offsetMinutes) % 60;
  
    return {
      hours: offsetMinutes >= 0 ? -offsetHours : offsetHours,
      minutes: offsetMinutes >= 0 ? -offsetMinutesRemainder : offsetMinutesRemainder
    };
  }
  