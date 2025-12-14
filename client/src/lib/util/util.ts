import { format, formatDistanceToNow, type DateArg } from "date-fns";
import z from "zod";

export function formatDate(date: DateArg<Date>) {
  return format(date, "d MMM yyyy h:mm a")
} 

export function timeAgo(date: string | Date) {
  return formatDistanceToNow(new Date(date)) + " ago";
}

export const requiredString = (fieldName: string) =>
  z.string().min(1, {
    message: `${fieldName} is required`,
  });

// export const requiredString = (fieldName: string) =>
//   z
//     .string({
//       invalid_type_error: `${fieldName} is required`,
//     })
//     .min(1, { message: `${fieldName} is required` });
