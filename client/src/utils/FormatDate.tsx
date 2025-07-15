import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export function formatDate(dateString: string) {
  const date = parseISO(dateString);
  
  const formattedDate = format(date, 'EEEE d MMMM yyyy', { 
    locale: fr 
  });
  
  return formattedDate
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/\b\w+\b/g, (word) => {
      if (word.length > 2) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    });
}

export function formatLocalTime(dateTimeString: string) {
  const date = parseISO(dateTimeString);
  
  const formattedTime = format(date, 'HH:mm');
  
  return formattedTime.replace(':', 'h');
}