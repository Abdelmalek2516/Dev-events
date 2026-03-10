import { notFound } from "next/navigation";
import Image from "next/image";
import { json } from "stream/consumers";
import BookEvent from "@/components/BookEvent";
import { IEvent } from "@/database/event.model";
import { getSimilairEventsBySlug } from "@/lib/ACTIONS/event.actions";
import { get } from "http";
import EventCrd from "@/components/EventCrd";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({icon , alt, label}: {icon: string, alt: string, label: string}) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
)

const EventAgenda = ({agendaItems}: {agendaItems: string[]}) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
)

const EventTags = ({tags}: {tags: string[]}) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map((tag) => (
      <div className="pill" key={tag}>{tag}</div>
    ))}
  </div>
) 
    
const EventDetailPage = async ({params}: {params: Promise<{slug: string}>}) => {
  const {slug} = await params;
  const request = await fetch(`${BASE_URL}/api/events/${slug}`);
  const { data: {description, image, overview, date, time, location, mode, audience, agenda, tags, organizer} } = await request.json();

  if (!description)
    return notFound();
  const bookings = 10;
  const SimilarEvents: IEvent[] = await getSimilairEventsBySlug(slug);

  return(
    <section id="event">
      <div className="header">
        <h1>Event description</h1>
        <p>{description}</p>
      </div>
      <div className="poster">
        <Image src={image} alt={description} width={800} height={500} className="poster" />
      </div>
      
      <div className="details">

        {/* left side event content */}

        <div className="content">
          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={date} />
            <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
            <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
            <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
            <EventDetailItem icon="/icons/audience.svg" alt="audience" label={audience} />
          </section>

          <EventAgenda agendaItems={agenda} />
          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
            </section>
          
          <EventTags tags={tags} />
            
        </div>

        {/* right side event content */}
          <aside className="booking">
            <div className="signup-card">
              <h2>Book your spot</h2>
              {bookings > 0 ? (
                <p className="text-sm">join {bookings} people who already booked their spot</p>
              ) : (
                <p className="text-sm">Be the first to book a spot!!.</p>
              )}

              <BookEvent />
            </div>
          </aside>


      </div>
      <div className="flex w-full flex-col pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {SimilarEvents.length > 0 && SimilarEvents.map((SimilarEvent: IEvent) => (
            <EventCrd key={SimilarEvent.title} {...SimilarEvent} />
            ))}
        </div>
      </div>

      



     
    </section>
  )
  
}
export default EventDetailPage;