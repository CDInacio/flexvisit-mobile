
export const formatDate = (date: string | undefined, format?: string) => {
  const newDate = new Date(date!);
  const day = String(newDate.getDate()).padStart(2, '0'); 
  const month = String(newDate.getMonth() + 1).padStart(2, '0'); 
  const year = newDate.getFullYear();
  const hours = String(newDate.getHours()).padStart(2, '0'); 
  const minutes = String(newDate.getMinutes()).padStart(2, '0');

  if (format === 'dd/mm/yyyy hh:mm') {
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  return `${day}/${month}/${year}`;
};

export const getDayOfWeekAndNumber = (dateString: string) => {
  const date = new Date(dateString);
  const daysOfWeek = ['dom', 'seg', 'ter', 'qua', 'quin', 'sex', 'sab'];
  const dayOfWeek = daysOfWeek[date.getDay()];
  const dayOfMonth = String(date.getDate()).padStart(2, '0'); 
  const formattedDate = {
    day: dayOfWeek?.charAt(0).toUpperCase() + dayOfWeek?.slice(1),
    number: dayOfMonth
  };

  return formattedDate;
};

// export const formatDateToCustomString = (dateString: string): string => {
//   const date = new Date(dateString);
//   const dayOfWeek = format(date, "EEEE", { locale: ptBR }).slice(0, 3); 
//   const capitalizedDayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1); 
//   const dayOfMonth = format(date, "dd", { locale: ptBR });
//   const month = format(date, "MMMM", { locale: ptBR });

//   return `${capitalizedDayOfWeek} ${dayOfMonth} ${month}`;
// };