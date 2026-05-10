import { z } from "zod";

export const reservationSchema = z.object({
    name: z.string().min(2, "Full Name must be at least 2 characters."),
    phone: z.string().min(10, "Please enter a valid phone number."),
    date: z.string().min(1, "Please select a date."),
    time: z.string().min(1, "Please select a time slot."),
    sessionType: z.string().min(1, "Please select a session type."),

    // We make guests optional here so the backend doesn't crash 
    // since your new UI design removed the guests field!
    guests: z.string().optional(),
});