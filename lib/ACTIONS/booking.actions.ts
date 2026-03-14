'use server';

import Booking from "@/database/booking.model";
import connectDB from "../mongodb";

export const createBooking = async (eventId: string, slug: string, email: string) => {
  try {
    await connectDB();
    await Booking.create({ eventId, email });
    return { success: true, message: 'Booking created successfully' };
  } catch (e) {
    // MongoDB duplicate key error code
    if (typeof e === 'object' && e !== null && 'code' in e && (e as { code: number }).code === 11000) {
      return { success: false, alreadyBooked: true, message: 'You have already booked this event' };
    }
    console.error('Booking error:', e);
    return { success: false, alreadyBooked: false, message: 'Something went wrong. Please try again.' };
  }
}
