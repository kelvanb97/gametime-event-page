import Link from "next/link";
import { events } from "@/data/events";

export default function Home() {
  return (
    <main>
      <h1>Gametime — Event Tickets</h1>
      <nav aria-label="Upcoming events">
        <h2>Upcoming Events</h2>
        <ul>
          {events.map((event) => (
            <li key={event.slug}>
              <Link href={`/events/${event.slug}`}>
                <strong>{event.shortName}</strong>
                {" — "}
                <time dateTime={event.startDate}>
                  {new Date(event.startDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
                {" at "}
                {event.venue.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}