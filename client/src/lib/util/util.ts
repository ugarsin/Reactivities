import { format, formatDistanceToNow, type DateArg } from "date-fns";

export function formatDate(date: DateArg<Date>) {
  return format(date, "d MMM yyyy h:mm a")
} 

export function timeAgo(date: string | Date) {
  return formatDistanceToNow(new Date(date)) + " ago";
}
