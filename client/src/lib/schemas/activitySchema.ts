import { z } from "zod"

const requiredString = (fieldName: string) => {
  return z.string().nonempty(`${fieldName} is required`);
}

const requiredDate = () =>
  z
    .string()
    .nonempty("Date is required")
    .refine((d) => !isNaN(Date.parse(d)), "Invalid date format")
    .refine((d) => new Date(d) > new Date(), "Date must be in the future");

export const activitySchema = z.object({
  title: requiredString("Title"),
  description: requiredString("Description"),
  category: requiredString("Category"),
  date: requiredDate(),
  location: z.object({
    venue: requiredString("Venue"),
    city: z.string().optional(),
    latitude: z.number(),
    longitude: z.number()
  })
})

export type ActivitySchema = z.infer<typeof activitySchema>;