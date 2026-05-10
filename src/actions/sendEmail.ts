"use server";

import { Resend } from 'resend';
import { reservationSchema } from '../lib/schemas';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitReservation(formData: FormData) {
    // THIS IS THE PING TO SEE IF THE BACKEND WAKES UP
    console.log("🚨 SERVER ACTION TRIGGERED! BACKEND IS AWAKE! 🚨");

    try {
        const data = Object.fromEntries(formData.entries());

        console.log("Raw incoming form data:", data);

        // Validate with Zod
        const validatedFields = reservationSchema.safeParse(data);

        if (!validatedFields.success) {
            console.error("Zod Validation Error:", validatedFields.error.flatten().fieldErrors);
            return {
                success: false,
                errors: validatedFields.error.flatten().fieldErrors,
                message: 'Please fix the errors in the form.',
            };
        }

        const { name, phone, date, time, sessionType } = validatedFields.data;

        const { data: resendData, error } = await resend.emails.send({
            from: 'Nutmeg Cafe <onboarding@resend.dev>',
            to: process.env.RESTAURANT_EMAIL || 'arpitsaugan2801@gmail.com',
            subject: `New Reservation from ${name}`,
            html: `
        <h2>New Reservation Details</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        ${sessionType ? `<p><strong>Session Type:</strong> ${sessionType === 'pottery' ? 'Blue Pottery' : sessionType === 'painting' ? 'Canvas Painting' : 'Both'}</p>` : ''}
      `,
        });

        if (error) {
            console.error('Resend Error:', error);
            return { success: false, message: 'Failed to send reservation email. Please try again later.' };
        }

        console.log("Email sent successfully! ID:", resendData?.id);
        return { success: true, message: 'Reservation confirmed!' };

    } catch (error) {
        console.error('Reservation Error:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}