import ExploreBtn from "@/components/Explorebtn";
import EventCrd from "@/components/EventCrd";
import events from "@/lib/constants";

 const page = () => {
  return (
    <section>
  <h1 className="text-center ">The home for every dev <br /> event you can't miss</h1>
  <p className="text-center mt-5 text-white"> Hackathons,meetups and conferences in one place</p>

  <ExploreBtn />
  
  <div className="mt-20 space-y-7">
    <h3> Featured events </h3>
    <ul className = "events">
      {events.map((event) => (
        <li  key={event.title}>
        <EventCrd {...event}/>
        </li>
        ))}
    </ul>
    </div>
  </section>
  )
}
export default page;