import { notFound } from "next/navigation";
import { getEventBySlug, getAllSlugs } from "@/data/events";
import { getTicketsForEvent, getPriceRange } from "@/data/tickets";
import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/utils";
import { generateEventJsonLd } from "@/lib/json-ld";
import TicketList from "@/components/ticket-list";

// ISR: revalidate every 60 seconds
export const revalidate = 60;

// Pre-render stub event slugs at build time
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// Dynamic metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return {};

  const { tickets } = getTicketsForEvent(slug);
  const priceRange = getPriceRange(tickets);

  const title = `${event.shortName} Tickets - ${new Date(event.startDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} | Gametime`;
  const description = `Get ${event.shortName} tickets for ${new Date(event.startDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} at ${event.venue.name}. Prices from $${priceRange.low}. Buy with confidence on Gametime.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${getBaseUrl()}/events/${slug}`,
      images: [{ url: event.imageUrl, alt: event.name }],
    },
    alternates: {
      canonical: `${getBaseUrl()}/events/${slug}`,
    },
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  const { tickets } = getTicketsForEvent(slug);
  const priceRange = getPriceRange(tickets);

  const formattedDate = new Date(event.startDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = new Date(event.startDate).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const doorsOpenTime = new Date(event.doorsOpen).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateEventJsonLd(event, tickets)),
        }}
      />
      <article>
        <header>
          <p>{event.category}</p>
          <h1>{event.name}</h1>
          <p>
            <time dateTime={event.startDate}>
              {formattedDate} at {formattedTime}
            </time>
          </p>
          <p>Doors open at {doorsOpenTime}</p>
          <address>
            {event.venue.name}
            <br />
            {event.venue.streetAddress}
            <br />
            {event.venue.addressLocality}, {event.venue.addressRegion}{" "}
            {event.venue.postalCode}
          </address>
        </header>

        <section aria-labelledby="tickets-heading">
          <h2 id="tickets-heading">Available Tickets</h2>
          <p>
            Prices from <strong>${priceRange.low}</strong> to{" "}
            <strong>${priceRange.high}</strong>
          </p>
          <TicketList eventSlug={event.slug} initialTickets={tickets} />
        </section>

        <section aria-labelledby="event-info-heading">
          <h2 id="event-info-heading">Event Information</h2>
          <p>{event.description}</p>
          <dl>
            <dt>Event</dt>
            <dd>{event.name}</dd>
            <dt>Date</dt>
            <dd>
              <time dateTime={event.startDate}>{formattedDate}</time>
            </dd>
            <dt>Time</dt>
            <dd>{formattedTime}</dd>
            <dt>Venue</dt>
            <dd>{event.venue.name}</dd>
            <dt>Location</dt>
            <dd>
              {event.venue.addressLocality}, {event.venue.addressRegion}
            </dd>
          </dl>
        </section>
      </article>
    </main>
  );
}