'use client';

import { createBooking } from "@/lib/ACTIONS/booking.actions";
import { useState } from "react";
import posthog from "posthog-js";

const BookEvent = ({ eventId, slug }: { eventId: string; slug: string }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const result = await createBooking(eventId, slug, email);

    if (result.success) {
      setSubmitted(true);
      posthog.capture('event_booked', { eventId, slug, email });
    } else {
      setErrorMessage(result.message ?? 'Something went wrong.');
      if (!result.alreadyBooked) posthog.captureException(result.message);
    }
  }
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">Thank you for booking your spot! We look forward to seeing you at the event.</p>
      ) :(
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email address</label>

              <input  type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />

            </div>

            {errorMessage && (
              <p className="text-sm text-red-400">{errorMessage}</p>
            )}
            <button type="submit" className ="button-submit">Submit</button>
          </form>
      )}
      
    </div>
 
  )
}


export default BookEvent;