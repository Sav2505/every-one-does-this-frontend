import { parseISO, format } from "date-fns";

export const formatDate = (isoString: string): string => {
  const date = parseISO(isoString);
  return format(date, "dd/MM/yyyy HH:mm");
};

export const getDate = () => {
  return new Date();
};
